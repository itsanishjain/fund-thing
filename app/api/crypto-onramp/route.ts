import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});

interface OnrampSessionResponse {
  client_secret: string;
  [key: string]: any;
}

const OnrampSessionResource = Stripe.StripeResource.extend({
  create: Stripe.StripeResource.method<OnrampSessionResponse>({
    method: "POST",
    path: "crypto/onramp_sessions",
  }),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { transaction_details } = body;

    const onrampSession = await new OnrampSessionResource(stripe).create({
      transaction_details: {
        destination_currency: transaction_details.destination_currency,
        destination_exchange_amount:
          transaction_details.destination_exchange_amount,
        destination_network: transaction_details.destination_network,
        wallet_address: transaction_details.wallet_address,
      },
      customer_ip_address: "127.0.0.1", // In production, use actual client IP
    });

    return NextResponse.json({ clientSecret: onrampSession.client_secret });
  } catch (error) {
    console.error("Error creating onramp session:", error);
    return NextResponse.json(
      { error: "Failed to create onramp session" },
      { status: 500 }
    );
  }
}
