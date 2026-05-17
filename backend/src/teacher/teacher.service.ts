import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { CurriculumVersion, ResourceType } from '@prisma/client';

@Injectable()
export class TeacherService {
  constructor(
    private prisma: PrismaService,
    private storage: StorageService,
  ) {}

  async getDashboard(schoolId: string) {
    // Get active subscriptions to infer assigned classes
    const subscriptions = await this.prisma.subscription.findMany({
      where: { schoolId, status: { in: ['ACTIVE', 'TRIAL'] } },
      select: { gradeLevel: true, status: true, trialEndsAt: true, currentPeriodEnd: true },
    });

    const assignedGrades = subscriptions.map(s => s.gradeLevel);

    // Get recent activity from access logs
    const recentActivity = await this.prisma.accessLog.findMany({
      where: { schoolId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { action: true, createdAt: true },
    });

    return {
      assignedGrades,
      subscriptions,
      recentActivity: recentActivity.map(a => ({
        action: a.action,
        time: a.createdAt,
      })),
    };
  }

  async getClassesOverview(schoolId: string, curriculumVersion: CurriculumVersion) {
    const subscriptions = await this.prisma.subscription.findMany({
      where: { schoolId, status: { in: ['ACTIVE', 'TRIAL'] } },
      select: { gradeLevel: true },
    });

    const assignedGrades = subscriptions.map(s => s.gradeLevel);

    // Get subjects available for this curriculum
    const subjects = await this.prisma.subject.findMany({
      where: { curriculumVersion },
      select: { code: true, name: true },
    });

    return {
      assignedGrades,
      subjects,
    };
  }

  async getLessons(schoolId: string, curriculumVersion: CurriculumVersion, gradeLevel: string, subjectCode: string) {
    // Verify school has active subscription for this grade
    const sub = await this.prisma.subscription.findFirst({
      where: {
        schoolId,
        gradeLevel,
        status: { in: ['ACTIVE', 'TRIAL'] },
      },
    });

    if (!sub) {
      throw new NotFoundException(`No active subscription for grade ${gradeLevel}`);
    }

    const subject = await this.prisma.subject.findUnique({
      where: { code_curriculumVersion: { code: subjectCode, curriculumVersion } },
    });

    if (!subject) {
      throw new NotFoundException(`Subject not found`);
    }

    // Return lesson metadata WITHOUT presigned URLs (fixes N+1 bottleneck)
    // URLs are generated on-demand via getResourceUrl()
    const lessons = await this.prisma.lesson.findMany({
      where: {
        subjectId: subject.id,
        gradeLevel,
        status: 'PUBLISHED',
      },
      include: {
        resources: {
          select: {
            id: true,
            type: true,
            fileName: true,
            fileSize: true,
            mimeType: true,
          },
        },
      },
      orderBy: [
        { term: 'asc' },
        { week: 'asc' },
      ],
    });

    return {
      subject: { code: subject.code, name: subject.name },
      lessons: lessons.map(lesson => ({
        id: lesson.id,
        term: lesson.term,
        week: lesson.week,
        title: lesson.title,
        resources: lesson.resources.map(res => ({
          id: res.id,
          type: res.type,
          title: res.fileName.replace(/\.[^/.]+$/, ''),
          fileSize: res.fileSize,
          mimeType: res.mimeType,
          // URL is NOT included — client must call GET /resources/:id/url
        })),
      })),
    };
  }

  /**
   * Generate a presigned URL for a specific resource ON DEMAND
   * This replaces the N+1 pattern of generating all URLs at once.
   * Architecture: 15-minute TTL presigned URLs, DRM enforced server-side
   */
  async getResourceUrl(resourceId: string, schoolId: string) {
    const resource = await this.prisma.resource.findUnique({
      where: { id: resourceId },
      include: {
        lesson: {
          include: { subject: true },
        },
      },
    });

    if (!resource) {
      throw new NotFoundException('Resource not found');
    }

    // Verify subscription for this grade
    const sub = await this.prisma.subscription.findFirst({
      where: {
        schoolId,
        gradeLevel: resource.lesson.gradeLevel,
        status: { in: ['ACTIVE', 'TRIAL'] },
      },
    });

    if (!sub) {
      throw new NotFoundException('No active subscription for this content');
    }

    // Determine if resource is downloadable per DRM rules
    const isDownloadable = ['STUDENT_NOTES', 'OBJECTIVE_QUESTIONS', 'THEORY_QUESTIONS'].includes(resource.type);
    const isViewOnly = ['LESSON_PLAN', 'POWERPOINT', 'LESSON_OBJECTIVES'].includes(resource.type);

    // Generate presigned URL with 15-minute TTL (architecture spec)
    const url = await this.storage.getPresignedUrl(resource.r2Key, 900);

    return {
      url,
      type: resource.type,
      fileName: resource.fileName,
      isDownloadable,
      isViewOnly,
    };
  }
}

