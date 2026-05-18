import { Controller, Post, Req, Res, Headers, BadRequestException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { SubscriptionService } from './subscription.service';
import Stripe from 'stripe';
import * as crypto from 'crypto';

@Controller('webhooks')
export class WebhookController {
  private stripe: Stripe;
  private readonly logger = new Logger(WebhookController.name);

  constructor(private subscriptionService: SubscriptionService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'dummy_key', {
      apiVersion: '2025-01-27.acacia' as any,
    });
  }

  @Post('stripe')
  async handleStripeWebhook(@Req() req: Request, @Res() res: Response, @Headers('stripe-signature') signature: string) {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    if (!endpointSecret) {
      this.logger.warn('Stripe webhook secret not configured.');
      return res.status(400).send('Webhook secret not configured');
    }

    let event;
    try {
      // In NestJS, req.body is already parsed, but Stripe requires raw body.
      // For this implementation, we assume a raw body middleware is set up, or we mock it.
      event = this.stripe.webhooks.constructEvent((req as any).rawBody || JSON.stringify(req.body), signature, endpointSecret);
    } catch (err: any) {
      this.logger.error(`Webhook Error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;
      
      // We expect metadata to contain schoolId, gradeLevel, and billingCycle
      if (session.metadata?.schoolId && session.metadata?.gradeLevel) {
        await this.subscriptionService.handlePaymentSuccess({
          schoolId: session.metadata.schoolId,
          gradeLevel: session.metadata.gradeLevel,
          billingCycle: session.metadata.billingCycle as any || 'MONTHLY',
          amount: session.amount_total,
          currency: session.currency.toUpperCase(),
          gateway: 'STRIPE',
          gatewayRef: session.payment_intent as string,
          customerId: session.customer as string,
          subscriptionId: session.subscription as string,
        });
      }
    }

    res.status(200).send();
  }

  @Post('paystack')
  async handlePaystackWebhook(@Req() req: Request, @Res() res: Response, @Headers('x-paystack-signature') signature: string) {
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
