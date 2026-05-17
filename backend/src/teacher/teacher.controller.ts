import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { SchoolStatusGuard } from '../auth/guards/school-status.guard';
import { SubscriptionAccessGuard } from '../auth/guards/subscription-access.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('teachers')
@UseGuards(JwtAuthGuard, RolesGuard, SchoolStatusGuard)
@Roles(UserRole.TEACHER, UserRole.SCHOOL_ADMIN)
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Get('dashboard')
  getDashboard(@Request() req: any) {
    return this.teacherService.getDashboard(req.user.schoolId);
  }

  @Get('classes')
  getClasses(@Request() req: any) {
    return this.teacherService.getClassesOverview(req.user.schoolId, req.user.curriculumVersion);
  }

  @UseGuards(SubscriptionAccessGuard)
  @Get('classes/:grade/:subject')
  getLessons(
    @Request() req: any,
    @Param('grade') grade: string,
    @Param('subject') subject: string,
  ) {
    return this.teacherService.getLessons(
      req.user.schoolId,
      req.user.curriculumVersion,
      grade.toUpperCase(),
      subject.toUpperCase(),
    );
  }

  @Get('resources/:id/url')
  getResourceUrl(@Request() req: any, @Param('id') id: string) {
    return this.teacherService.getResourceUrl(id, req.user.schoolId);
  }
}

