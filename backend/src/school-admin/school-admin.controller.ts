import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { SchoolAdminService } from './school-admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { SchoolStatusGuard } from '../auth/guards/school-status.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('school-admin')
@UseGuards(JwtAuthGuard, RolesGuard, SchoolStatusGuard)
@Roles(UserRole.SCHOOL_ADMIN)
export class SchoolAdminController {
  constructor(private readonly schoolAdminService: SchoolAdminService) {}

  @Get('dashboard')
  getDashboard(@Request() req: any) {
    return this.schoolAdminService.getDashboard(req.user.schoolId);
  }

  @Get('teachers')
  getTeachers(@Request() req: any) {
    return this.schoolAdminService.getTeachers(req.user.schoolId);
  }

  @Post('teachers')
  addTeacher(@Request() req: any, @Body() data: { name: string, email: string }) {
    return this.schoolAdminService.addTeacher(req.user.schoolId, data);
  }

  @Get('subscriptions')
  getSubscriptions(@Request() req: any) {
    return this.schoolAdminService.getSubscriptions(req.user.schoolId);
  }

  @Get('billing')
  getBillingHistory(@Request() req: any) {
    return this.schoolAdminService.getBillingHistory(req.user.schoolId);
  }
}
