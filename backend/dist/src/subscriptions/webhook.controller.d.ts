import { SubscriptionService } from './subscription.service';
export declare class WebhookController {
    private subscriptionService;
    private readonly logger;
    constructor(subscriptionService: SubscriptionService);
    handleStripeWebhook(req: any, res: any, signature: string): Promise<any>;
    handlePaystackWebhook(req: any, res: any, signature: string): Promise<any>;
}
