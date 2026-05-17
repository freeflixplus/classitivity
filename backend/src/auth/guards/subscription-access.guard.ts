import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Guard that verifies the requesting teacher has an active subscription
 * for the grade level they are trying to access.
 * Architecture: Step 5 of middleware stack — checkSubscription()
 */
@Injectable()
export class SubscriptionAccessGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Platform admins bypass subscription checks
    if (user?.role === 'PLATFORM_ADMIN') {
      return true;
    }

    // Extract grade from route params (e.g., /classes/:grade/:subject)
    const grade = request.params?.grade;
    if (!grade || !user?.schoolId) {
      return true; // Non-grade-specific routes pass through
    }

    const subscription = await this.prisma.subscription.findFirst({
      where: {
        schoolId: user.schoolId,
        gradeLevel: grade.toUpperCase(),
        OR: [
          { status: 'ACTIVE' },
          {
            status: 'TRIAL',
            trialEndsAt: { gte: new Date() },
          },
        ],
      },
    });

    if (!subscription) {
      throw new ForbiddenException(
        `No active subscription for grade ${grade}. Please subscribe to access this content.`,
      );
    }

    return true;
  }
}
