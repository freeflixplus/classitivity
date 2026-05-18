import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ContentModule } from './content/content.module';
import { StorageModule } from './storage/storage.module';
import { TeacherModule } from './teacher/teacher.module';
import { SchoolAdminModule } from './school-admin/school-admin.module';
import { PlatformAdminModule } from './platform-admin/platform-admin.module';
import { SubscriptionModule } from './subscriptions/subscription.module';
import { CurriculumModule } from './curriculum/curriculum.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 60,
    }]),

    PrismaModule,

    // Feature modules
    AuthModule,
    ContentModule,
    StorageModule,
    TeacherModule,
    SchoolAdminModule,
    PlatformAdminModule,
    SubscriptionModule,
    CurriculumModule,
    ScheduleModule.forRoot(),
  ],
})
export class AppModule {}

