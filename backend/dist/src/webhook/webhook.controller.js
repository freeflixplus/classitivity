"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var WebhookController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const subscription_service_1 = require("../subscription/subscription.service");
const client_1 = require("@prisma/client");
let WebhookController = WebhookController_1 = class WebhookController {
    prisma;
    subscriptionService;
    logger = new common_1.Logger(WebhookController_1.name);
    constructor(prisma, subscriptionService) {
        this.prisma = prisma;
        this.subscriptionService = subscriptionService;
    }
    async handleStripeWebhook(req, signature, res) {
        try {
            const event = req.body;
            this.logger.log(`Stripe webhook received: ${event.type}`);
            switch (event.type) {
                case 'checkout.session.completed':
                    await this.handlePaymentSucceeded(event.data?.object);
                    break;
                case 'invoice.payment_failed':
                    await this.handlePaymentFailed(event.data?.object);
                    break;
                case 'customer.subscription.deleted':
                    await this.handleSubscriptionCancelled(event.data?.object);
                    break;
                default:
                    this.logger.log(`Unhandled Stripe event type: ${event.type}`);
            }
            return res.json({ received: true });
        }
        catch (err) {
            this.logger.error(`Stripe webhook error: ${err.message}`);
            return res.status(400).json({ error: 'Webhook processing failed' });
        }
    }
    async handlePaystackWebhook(req, signature, res) {
        try {
            const event = req.body;
            this.logger.log(`Paystack webhook received: ${event.event}`);
            switch (event.event) {
                case 'charge.success':
                    await this.handlePaymentSucceeded(event.data);
                    break;
                case 'charge.failed':
                    await this.handlePaymentFailed(event.data);
                    break;
                case 'subscription.disable':
                    await this.handleSubscriptionCancelled(event.data);
                    break;
                default:
                    this.logger.log(`Unhandled Paystack event: ${event.event}`);
            }
            return res.json({ received: true });
        }
        catch (err) {
            this.logger.error(`Paystack webhook error: ${err.message}`);
            return res.status(400).json({ error: 'Webhook processing failed' });
        }
    }
    async handlePaymentSucceeded(data) {
        if (!data?.metadata?.subscriptionId) {
            this.logger.warn('Payment succeeded but no subscriptionId in metadata');
            return;
        }
        const subscriptionId = data.metadata.subscriptionId;
        await this.prisma.payment.updateMany({
            where: { gatewayRef: data.id || data.reference },
            data: {
                status: client_1.PaymentStatus.SUCCEEDED,
                paidAt: new Date(),
            },
        });
        await this.subscriptionService.activateSubscription(subscriptionId, data.customer || '', data.subscription || data.id || '');
        this.logger.log(`Payment succeeded, subscription ${subscriptionId} activated`);
    }
    async handlePaymentFailed(data) {
        if (!data?.metadata?.subscriptionId)
            return;
        await this.prisma.payment.updateMany({
            where: { gatewayRef: data.id || data.reference },
            data: { status: client_1.PaymentStatus.FAILED },
        });
        await this.prisma.subscription.update({
            where: { id: data.metadata.subscriptionId },
            data: { status: client_1.SubscriptionStatus.PAST_DUE },
        });
        this.logger.log(`Payment failed for subscription ${data.metadata.subscriptionId}`);
    }
    async handleSubscriptionCancelled(data) {
        if (!data?.metadata?.subscriptionId)
            return;
        await this.prisma.subscription.update({
            where: { id: data.metadata.subscriptionId },
            data: { status: client_1.SubscriptionStatus.CANCELLED },
        });
        this.logger.log(`Subscription ${data.metadata.subscriptionId} cancelled via gateway`);
    }
};
exports.WebhookController = WebhookController;
__decorate([
    (0, common_1.Post)('stripe'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Headers)('stripe-signature')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], WebhookController.prototype, "handleStripeWebhook", null);
__decorate([
    (0, common_1.Post)('paystack'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Headers)('x-paystack-signature')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], WebhookController.prototype, "handlePaystackWebhook", null);
exports.WebhookController = WebhookController = WebhookController_1 = __decorate([
    (0, common_1.Controller)('webhooks'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        subscription_service_1.SubscriptionService])
], WebhookController);
//# sourceMappingURL=webhook.controller.js.map