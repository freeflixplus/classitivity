import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { ContentStatus, ResourceType } from '@prisma/client';
import { CreateLessonDto } from './dto/content.dto';

@Injectable()
export class ContentService {
  private readonly logger = new Logger(ContentService.name);

  constructor(
    private prisma: PrismaService,
    private storage: StorageService,
  ) {}

  async uploadResource(
    lessonId: string,
    file: Express.Multer.File,
    resourceTypeStr: string,
    price: number = 0,
    currency: string = 'NGN',
  ) {
    // Validate lesson exists
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { subject: true },
    });
    if (!lesson) throw new NotFoundException('Lesson not found');

    // Parse and validate resource type
    const resourceType = resourceTypeStr.toUpperCase() as ResourceType;
    if (!Object.values(ResourceType).includes(resourceType)) {
      throw new BadRequestException(`Invalid resource type: ${resourceTypeStr}`);
    }

    // Check if resource already exists for this lesson+type
    const existing = await this.prisma.resource.findUnique({
      where: { lessonId_type: { lessonId, type: resourceType } },
    });

    // Build R2 key
    const ext = file.originalname.split('.').pop() || 'pdf';
    const r2Key = this.storage.buildKey(
      lesson.subject.curriculumVersion,
      lesson.gradeLevel,
      lesson.subject.code,
      lesson.term,
      lesson.week,
      resourceType.toLowerCase(),
      ext,
    );

    // Upload to R2
    await this.storage.uploadFile(r2Key, file.buffer, file.mimetype);

    // Upsert resource record
    if (existing) {
      // Delete old file from R2
      await this.storage.deleteFile(existing.r2Key);
      // Update record
      const resource = await this.prisma.resource.update({
        where: { id: existing.id },
        data: {
          fileName: file.originalname,
          fileSize: file.size,
          mimeType: file.mimetype,
          r2Key,
          price,
          currency,
        },
      });
      this.logger.log(`Replaced resource: ${resourceType} for lesson ${lessonId}`);
      return resource;
    } else {
      const resource = await this.prisma.resource.create({
        data: {
          lessonId,
          type: resourceType,
          fileName: file.originalname,
          fileSize: file.size,
          mimeType: file.mimetype,
          r2Key,
          price,
          currency,
        },
      });
      this.logger.log(`Created resource: ${resourceType} for lesson ${lessonId}`);
      return resource;
    }
  }

  async createLesson(dto: CreateLessonDto) {
    // Find or create subject
    let subject = await this.prisma.subject.findUnique({
      where: { code_curriculumVersion: { code: dto.subjectCode, curriculumVersion: dto.curriculumVersion as any } },
    });

    if (!subject) {
      subject = await this.prisma.subject.create({
        data: {
          name: dto.subjectName || dto.subjectCode,
          code: dto.subjectCode,
          curriculumVersion: dto.curriculumVersion as any,
        },
      });
    }

    return this.prisma.lesson.create({
      data: {
        subjectId: subject.id,
        gradeLevel: dto.gradeLevel,
        term: dto.term,
        week: dto.week,
        title: dto.title,
        description: dto.description,
      },
      include: { subject: true, resources: true },
    });
  }

  async getLessons(filters: {
    version?: string;
    grade?: string;
    subject?: string;
    term?: number;
    status?: string;
    page: number;
    limit: number;
  }) {
    const where: any = {};

    if (filters.grade) where.gradeLevel = filters.grade;
    if (filters.term) where.term = filters.term;
    if (filters.status) where.status = filters.status.toUpperCase() as ContentStatus;
    if (filters.version || filters.subject) {
      where.subject = {};
      if (filters.version) where.subject.curriculumVersion = filters.version;
      if (filters.subject) where.subject.code = filters.subject;
    }

    const [lessons, total] = await Promise.all([
      this.prisma.lesson.findMany({
        where,
        include: {
          subject: { select: { name: true, code: true, curriculumVersion: true } },
          resources: { select: { id: true, type: true, fileName: true, fileSize: true } },
        },
        orderBy: [{ term: 'asc' }, { week: 'asc' }],
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit,
      }),
      this.prisma.lesson.count({ where }),
    ]);

    return {
      data: lessons,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total,
        totalPages: Math.ceil(total / filters.limit),
      },
    };
  }

  async getLesson(id: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: {
        subject: true,
        resources: true,
      },
    });
    if (!lesson) throw new NotFoundException('Lesson not found');
    return lesson;
  }

  async updateLessonStatus(id: string, status: string) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id } });
    if (!lesson) throw new NotFoundException('Lesson not found');

    return this.prisma.lesson.update({
      where: { id },
      data: { status: status.toUpperCase() as ContentStatus },
      include: { subject: true, resources: true },
    });
  }

  async deleteResource(id: string) {
    const resource = await this.prisma.resource.findUnique({ where: { id } });
    if (!resource) throw new NotFoundException('Resource not found');

    // Delete from R2
    await this.storage.deleteFile(resource.r2Key);

    // Delete from database
    await this.prisma.resource.delete({ where: { id } });

    return { message: 'Resource deleted successfully' };
  }

  async getContentTree(version: string) {
    return this.prisma.class.findMany({
      where: { curriculumVersion: version.toUpperCase() as any },
      include: {
        subjects: {
          include: {
            terms: {
              include: {
                topics: {
                  include: {
                    lessons: true
                  }
                }
              }
            }
          }
        }
      }
    });
  }

  async createSchemeOfWork(dto: any) {
    return this.prisma.schemeOfWork.create({
      data: {
        subjectId: dto.subjectId,
        topicId: dto.topicId,
        termId: dto.termId,
        weekNumber: dto.weekNumber,
        lessonCount: dto.lessonCount,
      }
    });
  }
}
