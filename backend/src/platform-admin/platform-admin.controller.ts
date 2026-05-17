import { Controller, Get, Post, Body, Query, UseGuards, Patch, Param } from '@nestjs/common';
import { PlatformAdminService } from './platform-admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('platform-admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.PLATFORM_ADMIN)
export class PlatformAdminController {
  constructor(private readonly platformAdminService: PlatformAdminService) {}

  @Get('dashboard')
  getDashboard() {
    return this.platformAdminService.getDashboard();
  }

  @Get('schools')
  getSchools(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.platformAdminService.getSchools(+page, +limit);
  }

  @Post('schools')
  createSchool(@Body() data: { name: string; curriculumVersion: string; country: string; adminName: string; email: string; phone?: string }) {
    return this.platformAdminService.createSchool(data);
  }

  @Patch('schools/:id')
  updateSchool(@Param('id') id: string, @Body() data: { isActive?: boolean; name?: string }) {
    return this.platformAdminService.updateSchool(id, data);
  }

  @Get('content')
  getContentOverview(@Query('page') page = 1, @Query('limit') limit = 50) {
    return this.platformAdminService.getContentOverview(+page, +limit);
  }

  @Post('courses')
  createCourse(@Body() data: { title: string; subjectCode: string; curriculumVersion: string; gradeLevel: string; term: number; week: number; description?: string; status?: string }) {
    return this.platformAdminService.createCourse(data);
  }

  @Post('resources')
  createResource(@Body() data: { lessonId: string; type: string; fileName: string; fileSize: number; mimeType: string; price: number; currency: string }) {
    return this.platformAdminService.createResource(data);
  }

  @Get('analytics')
  getAnalytics() {
    return this.platformAdminService.getAnalytics();
  }

  @Get('payments')
  getPayments(@Query('page') page = 1, @Query('limit') limit = 50) {
    return this.platformAdminService.getPayments(+page, +limit);
  }

}

