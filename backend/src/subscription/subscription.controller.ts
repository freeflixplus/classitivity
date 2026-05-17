import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/subscription.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { SchoolStatusGuard } from '../auth/guards/school-status.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('subscriptions')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SCHOOL_ADMIN, UserRole.PLATFORM_ADMIN)
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get()
  getSubscriptions(@Request() req: any) {
    return this.subscriptionService.getSchoolSubscriptions(req.user.schoolId);
  }

  @Post()
  createSubscription(@Request() req: any, @Body() dto: CreateSubscriptionDto) {
    return this.subscriptionService.createSubscription(
      req.user.schoolId,
      dto.gradeLevel,
      dto.billingCycle,
    );
  }

  @Delete(':id')
  cancelSubscription(@Request() req: any, @Param('id') id: string) {
    return this.subscriptionService.cancelSubscription(req.user.schoolId, id);
  }
}
