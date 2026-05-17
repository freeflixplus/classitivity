import { Controller, Post, Req, Res, Headers, Logger, HttpCode, HttpStatus } from '@nestjs/common';
import type { Request, Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionService } from '../subscription/subscription.service';
import { PaymentStatus, SubscriptionStatus } from '@prisma/client';

/**
 * Webhook Controller
 * Architecture: Section 8 — Webhook Processing
 * Processes payment events from Stripe and Paystack asynchronously.
 * In production, these should be enqueued to BullMQ for idempotent processing.
 */
@Controller('webhooks')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(
    private prisma: PrismaService,
    private subscriptionService: SubscriptionService,
  ) {}

  /**
   * Stripe Webhook Receiver
   * Architecture: POST /api/webhooks/stripe → Verify signature → Process event
   */
  @Post('stripe')
  @HttpCode(HttpStatus.OK)
  async handleStripeWebhook(
    @Req() req: Request,
    @Headers('stripe-signature') signature: string,
    @Res() res: Response,
  ) {
    // TODO: Verify Stripe signature using STRIPE_WEBHOOK_SECRET
    // const event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);

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
    } catch (err) {
      this.logger.error(`Stripe webhook error: ${err.message}`);
      return res.status(400).json({ error: 'Webhook processing failed' });
    }
  }

  /**
   * Paystack Webhook Receiver
   * Architecture: POST /api/webhooks/paystack → Verify signature → Process event
   */
  @Post('paystack')
  @HttpCode(HttpStatus.OK)
  async handlePaystackWebhook(
    @Req() req: Request,
    @Headers('x-paystack-signature') signature: string,
    @Res() res: Response,
  ) {
    // TODO: Verify Paystack signature using PAYSTACK_WEBHOOK_SECRET
    // const hash = crypto.createHmac('sha512', paystackSecret).update(JSON.stringify(req.body)).digest('hex');

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
    } catch (err) {
      this.logger.error(`Paystack webhook error: ${err.message}`);
      return res.status(400).json({ error: 'Webhook processing failed' });
    }
  }

  private async handlePaymentSucceeded(data: any) {
    if (!data?.metadata?.subscriptionId) {
      this.logger.warn('Payment succeeded but no subscriptionId in metadata');
      return;
    }

    const subscriptionId = data.metadata.subscriptionId;

    // Record payment
    await this.prisma.payment.updateMany({
      where: { gatewayRef: data.id || data.reference },
      data: {
        status: PaymentStatus.SUCCEEDED,
        paidAt: new Date(),
      },
    });

    // Activate subscription
    await this.subscriptionService.activateSubscription(
      subscriptionId,
      data.customer || '',
      data.subscription || data.id || '',
    );

    this.logger.log(`Payment succeeded, subscription ${subscriptionId} activated`);
  }

  private async handlePaymentFailed(data: any) {
    if (!data?.metadata?.subscriptionId) return;

    await this.prisma.payment.updateMany({
      where: { gatewayRef: data.id || data.reference },
      data: { status: PaymentStatus.FAILED },
    });

    // Mark subscription as past due (7-day grace period per architecture)
    await this.prisma.subscription.update({
      where: { id: data.metadata.subscriptionId },
      data: { status: SubscriptionStatus.PAST_DUE },
    });

    // TODO: Send payment failed email to school admin

    this.logger.log(`Payment failed for subscription ${data.metadata.subscriptionId}`);
  }

  private async handleSubscriptionCancelled(data: any) {
    if (!data?.metadata?.subscriptionId) return;

    await this.prisma.subscription.update({
      where: { id: data.metadata.subscriptionId },
      data: { status: SubscriptionStatus.CANCELLED },
    });

    // TODO: Send cancellation confirmation email

    this.logger.log(`Subscription ${data.metadata.subscriptionId} cancelled via gateway`);
  }
}
