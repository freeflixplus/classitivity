"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var WebhookController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookController = void 0;
const common_1 = require("@nestjs/common");
const subscription_service_1 = require("./subscription.service");
const stripe_1 = __importDefault(require("stripe"));
const crypto = __importStar(require("crypto"));
let WebhookController = WebhookController_1 = class WebhookController {
    subscriptionService;
    stripe;
    logger = new common_1.Logger(WebhookController_1.name);
    constructor(subscriptionService) {
        this.subscriptionService = subscriptionService;
        this.stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY || 'dummy_key', {
            apiVersion: '2025-01-27.acacia',
        });
    }
    async handleStripeWebhook(req, res, signature) {
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
        if (!endpointSecret) {
            this.logger.warn('Stripe webhook secret not configured.');
            return res.status(400).send('Webhook secret not configured');
        }
        let event;
        try {
            event = this.stripe.webhooks.constructEvent(req.rawBody || JSON.stringify(req.body), signature, endpointSecret);
        }
        catch (err) {
            this.logger.error(`Webhook Error: ${err.message}`);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            if (session.metadata?.schoolId && session.metadata?.gradeLevel) {
                await this.subscriptionService.handlePaymentSuccess({
                    schoolId: session.metadata.schoolId,
                    gradeLevel: session.metadata.gradeLevel,
                    billingCycle: session.metadata.billingCycle || 'MONTHLY',
                    amount: session.amount_total,
                    currency: session.currency.toUpperCase(),
                    gateway: 'STRIPE',
                    gatewayRef: session.payment_intent,
                    customerId: session.customer,
                    subscriptionId: session.subscription,
                });
            }
        }
        res.status(200).send();
    }
    async handlePaystackWebhook(req, res, signature) {
        const secret = process.env.PAYSTACK_SECRET_KEY;
        if (!secret) {
            return res.status(400).send('Paystack secret not configured');
        }
        const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');
        if (hash !== signature) {
            return res.status(400).send('Invalid signature');
        }
        const event = req.body;
        if (event.event === 'charge.success') {
            const data = event.data;
            const metadata = data.metadata;
            if (metadata?.schoolId && metadata?.gradeLevel) {
                await this.subscriptionService.handlePaymentSuccess({
                    schoolId: metadata.schoolId,
                    gradeLevel: metadata.gradeLevel,
                    billingCycle: metadata.billingCycle || 'MONTHLY',
                    amount: data.amount,
                    currency: data.currency || 'NGN',
                    gateway: 'PAYSTACK',
                    gatewayRef: data.reference,
                });
            }
        }
        res.status(200).send();
    }
};
exports.WebhookController = WebhookController;
__decorate([
    (0, common_1.Post)('stripe'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Headers)('stripe-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], WebhookController.prototype, "handleStripeWebhook", null);
__decorate([
    (0, common_1.Post)('paystack'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Headers)('x-paystack-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], WebhookController.prototype, "handlePaystackWebhook", null);
exports.WebhookController = WebhookController = WebhookController_1 = __decorate([
    (0, common_1.Controller)('webhooks'),
    __metadata("design:paramtypes", [subscription_service_1.SubscriptionService])
], WebhookController);
//# sourceMappingURL=webhook.controller.js.map