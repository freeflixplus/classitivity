import { Request, Response } from 'express';
import { SubscriptionService } from './subscription.service';
export declare class WebhookController {
    private subscriptionService;
    private stripe;
    private readonly logger;
    constructor(subscriptionService: SubscriptionService);
    handleStripeWebhook(req: Request, res: Response, signature: string): Promise<Response<any, Record<string, any>> | undefined>;
    handlePaystackWebhook(req: Request, res: Response, signature: string): Promise<Response<any, Record<string, any>> | undefined>;
}
