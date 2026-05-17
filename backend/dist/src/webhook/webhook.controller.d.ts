import type { Request, Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionService } from '../subscription/subscription.service';
export declare class WebhookController {
    private prisma;
    private subscriptionService;
    private readonly logger;
    constructor(prisma: PrismaService, subscriptionService: SubscriptionService);
    handleStripeWebhook(req: Request, signature: string, res: Response): Promise<Response<any, Record<string, any>>>;
    handlePaystackWebhook(req: Request, signature: string, res: Response): Promise<Response<any, Record<string, any>>>;
    private handlePaymentSucceeded;
    private handlePaymentFailed;
    private handleSubscriptionCancelled;
}
