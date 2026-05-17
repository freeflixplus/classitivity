import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
import { BillingCycle, PaymentGateway } from '@prisma/client';

export class CreateSubscriptionDto {
  @IsNotEmpty()
  @IsString()
  gradeLevel: string;

  @IsEnum(BillingCycle)
  billingCycle: BillingCycle;

  @IsOptional()
  @IsEnum(PaymentGateway)
  gateway?: PaymentGateway;
}
