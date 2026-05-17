import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { UserRole } from '@prisma/client';

@Injectable()
export class SchoolAdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(schoolId: string) {
    const [subscriptionsCount, teachersCount, accessLogs] = await Promise.all([
      this.prisma.subscription.count({ where: { schoolId, status: 'ACTIVE' } }),
      this.prisma.user.count({ where: { schoolId, role: 'TEACHER' } }),
      this.prisma.accessLog.findMany({
        where: { schoolId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { user: { select: { name: true } } }
      })
    ]);

    const activeSubscriptions = await this.prisma.subscription.findMany({
      where: { schoolId, status: 'ACTIVE' },
      select: { gradeLevel: true, status: true }
    });

    return {
      stats: {
        activeSubscriptions: subscriptionsCount,
        totalTeachers: teachersCount,
        resourcesAccessed: 0, // Placeholder
        nextRenewal: 'Jun 15' // Placeholder
      },
      activeSubscriptions,
      recentActivity: accessLogs.map(log => ({
        name: log.user.name,
        action: log.action,
        time: log.createdAt
      }))
    };
  }

  async getTeachers(schoolId: string) {
    return this.prisma.user.findMany({
      where: { schoolId, role: 'TEACHER' },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        lastLoginAt: true,
      }
    });
  }

  async addTeacher(schoolId: string, data: { name: string, email: string }) {
    // Generate a secure random temporary password
    const crypto = await import('crypto');
    const tempPassword = crypto.randomBytes(8).toString('base64url').slice(0, 12);
    const passwordHash = await bcrypt.hash(tempPassword, 12);

    const teacher = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        role: UserRole.TEACHER,
        schoolId,
      },
      select: { id: true, name: true, email: true }
    });

    // TODO: Send welcome email with temporary password via email service
    // For now, return the temp password so school admin can share it
    return { ...teacher, temporaryPassword: tempPassword };
  }

  async getSubscriptions(schoolId: string) {
    return this.prisma.subscription.findMany({
      where: { schoolId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getBillingHistory(schoolId: string) {
    return this.prisma.payment.findMany({
      where: { schoolId },
      orderBy: { createdAt: 'desc' },
      include: {
        subscription: { select: { gradeLevel: true, billingCycle: true } }
      }
    });
  }
}
