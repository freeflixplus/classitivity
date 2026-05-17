import { Controller, Get, Param, Query } from '@nestjs/common';
import { CURRICULUM_CONFIGS, getCurriculumConfig } from '../config/curriculum.config';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Curriculum Controller
 * Architecture: Section 10 — /api/curriculum/* routes
 * Public endpoints for browsing curriculum structure (no auth required for basic info)
 */
@Controller('curriculum')
export class CurriculumController {
  constructor(private prisma: PrismaService) {}

  /**
   * GET /api/curriculum/versions
   * List all available curriculum versions
   */
  @Get('versions')
  getVersions() {
    return Object.values(CURRICULUM_CONFIGS).map(c => ({
      code: c.code,
      label: c.label,
      currency: c.currency,
      termModel: c.termModel,
      examRefs: c.examRefs,
    }));
  }

  /**
   * GET /api/curriculum/grades?version=NG
   * List grades for a given curriculum version
   */
  @Get('grades')
  getGrades(@Query('version') version: string) {
    const config = getCurriculumConfig(version || 'NG');
    if (!config) return { error: 'Invalid curriculum version' };

    return {
      version: config.code,
      gradeGroups: config.gradeGroups,
    };
  }

  /**
   * GET /api/curriculum/grades/:gradeCode/subjects?version=NG
   * List subjects available for a grade in a curriculum version
   */
  @Get('grades/:gradeCode/subjects')
  async getSubjects(
    @Param('gradeCode') gradeCode: string,
    @Query('version') version: string,
  ) {
    const subjects = await this.prisma.subject.findMany({
      where: { curriculumVersion: (version || 'NG') as any },
      select: { id: true, code: true, name: true },
      orderBy: { name: 'asc' },
    });

    return {
      version: version || 'NG',
      gradeCode: gradeCode.toUpperCase(),
      subjects,
    };
  }

  /**
   * GET /api/curriculum/subjects/:subjectCode/terms?version=NG&grade=JSS1
   * List terms/semesters for a subject
   */
  @Get('subjects/:subjectCode/terms')
  async getTerms(
    @Param('subjectCode') subjectCode: string,
    @Query('version') version: string,
    @Query('grade') grade: string,
  ) {
    const config = getCurriculumConfig(version || 'NG');
    if (!config) return { error: 'Invalid curriculum version' };

    // Get distinct terms from lessons for this subject + grade
    const lessons = await this.prisma.lesson.findMany({
      where: {
        subject: {
          code: subjectCode.toUpperCase(),
          curriculumVersion: (version || 'NG') as any,
        },
        gradeLevel: grade?.toUpperCase(),
        status: 'PUBLISHED',
      },
      select: { term: true },
      distinct: ['term'],
      orderBy: { term: 'asc' },
    });

    return {
      version: config.code,
      subjectCode: subjectCode.toUpperCase(),
      termModel: config.termModel,
      terms: lessons.map(l => ({
        number: l.term,
        label: config.termModel === 'semester' ? `Semester ${l.term}` : `Term ${l.term}`,
      })),
    };
  }

  /**
   * GET /api/curriculum/terms/:termNumber/lessons?version=NG&grade=JSS1&subject=MATH
   * Scheme of Work — list all lessons for a term
   */
  @Get('terms/:termNumber/lessons')
  async getLessons(
    @Param('termNumber') termNumber: string,
    @Query('version') version: string,
    @Query('grade') grade: string,
    @Query('subject') subject: string,
  ) {
    const lessons = await this.prisma.lesson.findMany({
      where: {
        term: parseInt(termNumber),
        gradeLevel: grade?.toUpperCase(),
        status: 'PUBLISHED',
        subject: {
          code: subject?.toUpperCase(),
          curriculumVersion: (version || 'NG') as any,
        },
      },
      select: {
        id: true,
        title: true,
        week: true,
        term: true,
        description: true,
        resources: {
          select: { id: true, type: true },
        },
      },
      orderBy: { week: 'asc' },
    });

    return {
      term: parseInt(termNumber),
      gradeLevel: grade?.toUpperCase(),
      subjectCode: subject?.toUpperCase(),
      lessons,
    };
  }
}
