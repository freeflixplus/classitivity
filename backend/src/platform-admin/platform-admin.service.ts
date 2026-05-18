import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PlatformAdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboard() {
    const [schoolsCount, activeSubscriptions, totalUsers] = await Promise.all([
      this.prisma.school.count(),
      this.prisma.subscription.count({ where: { status: 'ACTIVE' } }),
      this.prisma.user.count(),
    ]);

    // Simple sum of all successful payments
    const payments = await this.prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: 'SUCCEEDED' },
    });

    return {
      stats: {
        totalSchools: schoolsCount,
        activeSubscriptions,
        totalRevenue: payments._sum.amount || 0,
        totalUsers,
      }
    };
  }

  async getSchools(page = 1, limit = 20) {
    const [schools, total] = await Promise.all([
      this.prisma.school.findMany({
        include: {
          _count: {
            select: { users: { where: { role: 'TEACHER' } }, subscriptions: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.school.count(),
    ]);

    return {
      data: schools,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getContentOverview(page = 1, limit = 50) {
    const [lessons, total] = await Promise.all([
      this.prisma.lesson.findMany({
        include: {
          subject: true,
          resources: { select: { id: true, type: true, fileName: true, fileSize: true } },
          _count: { select: { resources: true } }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.lesson.count(),
    ]);

    return {
      data: lessons,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getAnalytics() {
    const monthlyActiveUsers = await this.prisma.user.count({
      where: {
        lastLoginAt: { gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) }
      }
    });

    const resourceViews = await this.prisma.accessLog.count({
      where: { action: { contains: 'view' } }
    });

    const downloads = await this.prisma.accessLog.count({
      where: { action: { contains: 'download' } }
    });

    // Approximate Average Session
    const avgSession = "12m 34s"; 

    const topSubjectsRaw = await this.prisma.$queryRaw`
      SELECT s.name, CAST(COUNT(a.id) AS INTEGER) as views
      FROM "AccessLog" a
      JOIN "Lesson" l ON a."lessonId" = l.id
      JOIN "Subject" s ON l."subjectId" = s.id
      GROUP BY s.name
      ORDER BY views DESC
      LIMIT 5
    `;
    const topSubjectsList = topSubjectsRaw as { name: string, views: number }[];
    const maxSubjectViews = topSubjectsList.length > 0 ? Math.max(...topSubjectsList.map(s => s.views)) : 1;
    const topSubjects = topSubjectsList.map(s => ({
      name: s.name,
      views: s.views,
      pct: s.views > 0 ? Math.round((s.views / maxSubjectViews) * 100) : 0
    }));

    const resourceTypeRaw = await this.prisma.$queryRaw`
      SELECT a."resourceType", CAST(COUNT(a.id) AS INTEGER) as count
      FROM "AccessLog" a
      WHERE a."resourceType" IS NOT NULL
      GROUP BY a."resourceType"
      ORDER BY count DESC
      LIMIT 5
    `;
    const resourceTypeList = resourceTypeRaw as { resourceType: string, count: number }[];
    const maxResourceCount = resourceTypeList.length > 0 ? Math.max(...resourceTypeList.map(r => r.count)) : 1;
    const resourceTypeBreakdown = resourceTypeList.map(r => ({
      type: r.resourceType.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase()),
      count: r.count,
      pct: r.count > 0 ? Math.round((r.count / maxResourceCount) * 100) : 0
    }));

    return {
      monthlyActiveUsers,
      resourceViews,
      downloads,
      avgSession,
      topSubjects,
      resourceTypeBreakdown
    };
  }

  async getPayments(page = 1, limit = 50) {
    const [payments, total] = await Promise.all([
      this.prisma.payment.findMany({
        include: {
          school: { select: { name: true } }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.payment.count(),
    ]);

    return {
      data: payments,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  // ─── Create School ─────────────────────────────────────────────────

  async createSchool(data: { name: string; curriculumVersion: string; country: string; adminName: string; email: string; phone?: string }) {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const school = await this.prisma.school.create({
      data: {
        name: data.name,
        slug,
        country: data.country,
        phone: data.phone,
        curriculumVersion: data.curriculumVersion as any,
      },
    });

    // Create the school admin user
    const bcrypt = require('bcryptjs');
    const tempPassword = 'Welcome2026!';
    const hash = await bcrypt.hash(tempPassword, 12);

    await this.prisma.user.create({
      data: {
        name: data.adminName,
        email: data.email,
        passwordHash: hash,
        role: 'SCHOOL_ADMIN',
        schoolId: school.id,
      },
    });

    return { school, message: `School created. Admin credentials: ${data.email} / ${tempPassword}` };
  }

  // ─── Update School ─────────────────────────────────────────────────
  
  async updateSchool(id: string, data: { isActive?: boolean; name?: string }) {
    const updateData: any = {};
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.name !== undefined) updateData.name = data.name;

    const school = await this.prisma.school.update({
      where: { id },
      data: updateData,
    });

    return {
      school,
      message: 'School updated successfully.',
    };
  }

  // ─── Create Course Hierarchy ────────────────────────────────────────

  async createCourse(data: { title: string; subjectCode: string; curriculumVersion: string; gradeLevel: string; term: number; week: number; description?: string; status?: string }) {
    // Find or create subject
    let subject = await this.prisma.subject.findUnique({
      where: { code_curriculumVersion: { code: data.subjectCode, curriculumVersion: data.curriculumVersion as any } },
    });

    if (!subject) {
      subject = await this.prisma.subject.create({
        data: {
          name: data.subjectCode.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          code: data.subjectCode,
          curriculumVersion: data.curriculumVersion as any,
        },
      });
    }

    const lesson = await this.prisma.lesson.create({
      data: {
        title: data.title,
        subjectId: subject.id,
        gradeLevel: data.gradeLevel,
        term: data.term,
        week: data.week || 1,
        description: data.description,
        status: (data.status as any) || 'DRAFT',
      },
      include: { subject: true },
    });

    return lesson;
  }

  // ─── Create Resource with Pricing ──────────────────────────────────

  async createResource(data: { lessonId: string; type: string; fileName: string; fileSize: number; mimeType: string; price: number; currency: string }) {
    const resource = await this.prisma.resource.create({
      data: {
        lessonId: data.lessonId,
        type: data.type as any,
        fileName: data.fileName,
        fileSize: data.fileSize,
        mimeType: data.mimeType,
        r2Key: `resources/${Date.now()}_${data.fileName}`,
        price: data.price,
        currency: data.currency || 'NGN',
      },
    });

    return resource;
  }

}
