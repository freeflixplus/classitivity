import { Module } from '@nestjs/common';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { StorageModule } from '../storage/storage.module';
import { WatermarkService } from './watermark.service';

@Module({
  imports: [StorageModule],
  controllers: [ContentController],
  providers: [ContentService, WatermarkService],
  exports: [ContentService, WatermarkService],
})
export class ContentModule {}
