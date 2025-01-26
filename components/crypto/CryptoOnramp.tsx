"use client";

import { useState } from "react";
import { loadStripeOnramp } from "@stripe/crypto";
import { CryptoElements, OnrampElement } from "./StripeCryptoElements";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { env } from "@/env";
import { useUser } from "@account-kit/react";
import { useToast } from "@/components/ui/use-toast";

// Make sure to call loadStripeOnramp outside of a component's render
const stripeOnrampPromise = loadStripeOnramp(
  env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export function CryptoOnramp() {
  const [clientSecret, setClientSecret] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const user = useUser();
  const { toast } = useToast();

  const initializeOnrampSession = async () => {
    console.log("user", user);
    if (!user?.address) {
      toast({
        title: "Please login to continue",
        description: "You must be logged in to purchase crypto",
      });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/crypto-onramp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transaction_details: {
            destination_currency: "usdc",
            destination_exchange_amount: "13.37",
            destination_network: "ethereum",
            wallet_address: user?.address,
          },
        }),
      });
      const data = await response.json();
      setClientSecret(data.clientSecret);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = ({ session }: { session: any }) => {
    setMessage(`OnrampSession is now in ${session.status} state.`);
  };

  return (
    <Card className="w-full max-w-xl mx-auto bg-gradient-to-br from-slate-50 to-white border border-slate-200 shadow-lg rounded-xl">
      <CardHeader className="space-y-2 pb-6">
        <CardTitle className="text-2xl font-bold text-slate-900">
          Buy Crypto
        </CardTitle>
        <p className="text-slate-600">
          Purchase cryptocurrency directly with your preferred payment method
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {!clientSecret ? (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                Ready to get started? Click below to begin your crypto purchase
                journey.
              </p>
            </div>
            <Button
              onClick={initializeOnrampSession}
              disabled={loading}
              className="w-full h-12 text-lg font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Initializing...</span>
                </div>
              ) : (
                "Start Purchase"
              )}
            </Button>
          </div>
        ) : (
          <div className="w-full min-h-[600px] rounded-lg border border-slate-200 bg-white shadow-sm">
            <CryptoElements stripeOnramp={stripeOnrampPromise}>
              <OnrampElement
                clientSecret={clientSecret}
                appearance={{
                  theme: "light",
                }}
                onChange={handleChange}
                onReady={() => {
                  console.log("OnrampElement is ready");
                }}
              />
            </CryptoElements>
          </div>
        )}

        {message && (
          <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-sm text-center text-slate-600 font-medium">
              {message}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
