import { Controller, Post, Req, Res, Headers, Logger } from '@nestjs/common';
import type { Request, Response } from 'express';
import { SubscriptionService } from './subscription.service';
import * as crypto from 'crypto';

@Controller('webhooks')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(private subscriptionService: SubscriptionService) {}

  @Post('stripe')
  async handleStripeWebhook(@Req() req: any, @Res() res: any, @Headers('stripe-signature') signature: string) {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!endpointSecret) {
      this.logger.warn('Stripe webhook secret not configured.');
      return res.status(400).send('Webhook secret not configured');
    }

    try {
      // Dynamic import so the build doesn't fail if stripe isn't installed
      const Stripe = require('stripe');
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'dummy_key');
      const event = stripe.webhooks.constructEvent(
        (req as any).rawBody || JSON.stringify(req.body),
        signature,
        endpointSecret,
      );

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
            gatewayRef: session.payment_intent as string,
            customerId: session.customer as string,
            subscriptionId: session.subscription as string,
          });
        }
      }
    } catch (err: any) {
      this.logger.error(`Stripe Webhook Error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    res.status(200).send();
  }

  @Post('paystack')
  async handlePaystackWebhook(@Req() req: any, @Res() res: any, @Headers('x-paystack-signature') signature: string) {
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
}
