import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { WebhookController } from './webhook.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [WebhookController],
  providers: [SubscriptionService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
