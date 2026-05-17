import { Module } from '@nestjs/common';
import { CurriculumController } from './curriculum.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CurriculumController],
})
export class CurriculumModule {}
