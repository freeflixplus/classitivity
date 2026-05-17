import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Guard that checks if the requesting user's school has an active status.
 * Blocks access for suspended schools and expired trial accounts.
 * Architecture: Step 3 of middleware stack — checkSchoolStatus()
 */
@Injectable()
export class SchoolStatusGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Platform admins are not tied to a school
    if (!user?.schoolId || user.role === 'PLATFORM_ADMIN') {
      return true;
    }

    const school = await this.prisma.school.findUnique({
      where: { id: user.schoolId },
      select: { isActive: true },
    });

    if (!school) {
      throw new ForbiddenException('School not found');
    }

    if (!school.isActive) {
      throw new ForbiddenException(
        'Your school account has been suspended. Please contact support.',
      );
    }

    // Check for expired trial subscriptions
    const activeSubs = await this.prisma.subscription.findFirst({
      where: {
        schoolId: user.schoolId,
        OR: [
          { status: 'ACTIVE' },
          {
            status: 'TRIAL',
            trialEndsAt: { gte: new Date() },
          },
        ],
      },
    });

    if (!activeSubs) {
      throw new ForbiddenException(
        'Your school subscription has expired. Please renew to continue accessing resources.',
      );
    }

    return true;
  }
}
