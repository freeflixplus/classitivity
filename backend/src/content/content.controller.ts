import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ContentService } from './content.service';
import { CreateLessonDto, UpdateLessonStatusDto } from './dto/content.dto';

@Controller('admin/content')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('PLATFORM_ADMIN')
export class ContentController {
  constructor(private contentService: ContentService) {}

  /**
   * Upload a resource file for a lesson
   * POST /admin/content/lessons/:lessonId/resources
   * Multipart form: file + resourceType
   */
  @Post('lessons/:lessonId/resources')
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
    fileFilter: (_req, file, cb) => {
      const allowed = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.ms-powerpoint',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      if (allowed.includes(file.mimetype) || file.originalname.match(/\.(pdf|docx?|pptx?)$/i)) {
        cb(null, true);
      } else {
        cb(new BadRequestException(`File type not supported: ${file.mimetype}. Allowed: PDF, DOC, DOCX, PPT, PPTX`), false);
      }
    },
  }))
  async uploadResource(
    @Param('lessonId') lessonId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('resourceType') resourceType: string,
    @Body('price') price?: string,
    @Body('currency') currency?: string,
  ) {
    if (!file) throw new BadRequestException('No file received. Please select a file to upload.');
    if (!resourceType) throw new BadRequestException('Resource type is required (e.g. LESSON_PLAN, POWERPOINT).');
    
    const parsedPrice = price ? parseInt(price) : 0;
    
    try {
      return await this.contentService.uploadResource(lessonId, file, resourceType, parsedPrice, currency || 'NGN');
    } catch (err: any) {
      // Re-throw NestJS exceptions as-is
      if (err.status) throw err;
      // Wrap unknown errors with context
      throw new BadRequestException(`Upload failed: ${err.message || 'Unknown server error'}`);
    }
  }

  /**
   * Create a new lesson entry
   * POST /admin/content/lessons
   */
  @Post('lessons')
  async createLesson(@Body() dto: CreateLessonDto) {
    return this.contentService.createLesson(dto);
  }

  /**
   * Get all lessons with filtering
   * GET /admin/content/lessons?version=NG&grade=JSS2&subject=Mathematics&term=1&status=published
   */
  @Get('lessons')
  async getLessons(
    @Query('version') version?: string,
    @Query('grade') grade?: string,
    @Query('subject') subject?: string,
    @Query('term') term?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.contentService.getLessons({
      version,
      grade,
      subject,
      term: term ? parseInt(term) : undefined,
      status,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
    });
  }

  /**
   * Get a single lesson with all resources
   * GET /admin/content/lessons/:id
   */
  @Get('lessons/:id')
  async getLesson(@Param('id') id: string) {
    return this.contentService.getLesson(id);
  }

  /**
   * Update lesson status (Draft → Review → Published)
   * PATCH /admin/content/lessons/:id/status
   */
  @Patch('lessons/:id/status')
  async updateLessonStatus(
    @Param('id') id: string,
    @Body() dto: UpdateLessonStatusDto,
  ) {
    return this.contentService.updateLessonStatus(id, dto.status);
  }

  /**
   * Delete a resource file
   * DELETE /admin/content/resources/:id
   */
  @Delete('resources/:id')
  async deleteResource(@Param('id') id: string) {
    return this.contentService.deleteResource(id);
  }

  /**
   * Get full hierarchical content tree for a curriculum version
   * GET /admin/content/content-tree/:version
   */
  @Get('content-tree/:version')
  async getContentTree(@Param('version') version: string) {
    return this.contentService.getContentTree(version);
  }

  /**
   * Create a scheme of work entry
   * POST /admin/content/scheme-of-work
   */
  @Post('scheme-of-work')
  async createSchemeOfWork(@Body() dto: any) {
    return this.contentService.createSchemeOfWork(dto);
  }
}
