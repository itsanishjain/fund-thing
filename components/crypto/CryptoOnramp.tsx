"use client";

import { useState, useEffect } from "react";
import { loadStripeOnramp } from "@stripe/crypto";
import { CryptoElements, OnrampElement } from "./StripeCryptoElements";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Icons } from "@/components/ui/icons";

// Make sure to call loadStripeOnramp outside of a component's render
const stripeOnrampPromise = loadStripeOnramp(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export function CryptoOnramp() {
  const [clientSecret, setClientSecret] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const initializeOnrampSession = async () => {
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
            wallet_address: "0x1107A5a773ac7253c12f2D79F5d981C23DA147AC",
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
    <Card className="w-full max-w-md mx-auto border-none shadow-none">
      <CardHeader>
        <CardTitle>Buy Crypto</CardTitle>
      </CardHeader>
      <CardContent>
        {!clientSecret ? (
          <Button
            onClick={initializeOnrampSession}
            disabled={loading}
            className="w-full"
          >
            {loading && "Loading..."}
            Start Purchase
          </Button>
        ) : (
          <div className="w-full min-h-[600px]">
            <CryptoElements stripeOnramp={stripeOnrampPromise}>
              <OnrampElement
                clientSecret={clientSecret}
                appearance={{ theme: "light" }}
                onChange={handleChange}
                onReady={() => {
                  console.log("OnrampElement is ready");
                }}
              />
            </CryptoElements>
          </div>
        )}

        {message && (
          <p className="mt-4 text-sm text-center text-muted-foreground">
            {message}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
