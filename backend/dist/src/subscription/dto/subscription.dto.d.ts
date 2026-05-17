import { BillingCycle, PaymentGateway } from '@prisma/client';
export declare class CreateSubscriptionDto {
    gradeLevel: string;
    billingCycle: BillingCycle;
    gateway?: PaymentGateway;
}
