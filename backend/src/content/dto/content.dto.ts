import { IsNotEmpty, IsString, IsNumber, IsOptional, IsEnum, Min, Max } from 'class-validator';

export class CreateLessonDto {
  @IsNotEmpty()
  @IsString()
  subjectCode: string;

  @IsOptional()
  @IsString()
  subjectName?: string;

  @IsNotEmpty()
  @IsString()
  curriculumVersion: string;

  @IsNotEmpty()
  @IsString()
  gradeLevel: string;

  @IsNumber()
  @Min(1)
  @Max(3)
  term: number;

  @IsNumber()
  @Min(1)
  @Max(14)
  week: number;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateLessonStatusDto {
  @IsNotEmpty()
  @IsString()
  status: string;
}
