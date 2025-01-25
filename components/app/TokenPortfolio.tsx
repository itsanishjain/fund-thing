//@ts-nocheck

"use client";

import React, { useState, useEffect } from "react";
import { Network, Alchemy } from "alchemy-sdk";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { env } from "@/env";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AlertTriangle } from "lucide-react";

const TOKENS = {
  ETH: {
    symbol: "ETH",
    address: "native", // ETH is a native token
    decimals: 18,
    icon: "⟠",
  },
  USDC: {
    symbol: "USDC",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    decimals: 6,
    icon: "$",
  },
  USDT: {
    symbol: "USDT",
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    decimals: 6,
    icon: "$",
  },
};

const settings = {
  apiKey: env.NEXT_PUBLIC_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

type TokenInfo = {
  symbol: string;
  address: string;
  decimals: number;
  icon: string;
  balance: number;
  price: number;
  value: number;
};

const TokenPortfolio = ({
  walletAddress = "vitalik.eth",
}: {
  walletAddress: string;
}) => {
  const [tokenData, setTokenData] = useState<TokenInfo[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalValue, setTotalValue] = useState<number>(0);

  useEffect(() => {
    fetchTokenData();
  }, [walletAddress]);

  const fetchTokenData = async () => {
    try {
      setLoading(true);

      // Fetch balances
      const balances = await alchemy.core.getTokenBalances(
        walletAddress,
        Object.values(TOKENS).map((token) => token.address)
      );

      console.log(balances);

      // Fetch token prices
      //   const pricePromises = Object.keys(TOKENS).map((symbol) =>
      //     fetch(
      //       `https://api.g.alchemy.com/prices/v1/tokens/by-symbol?symbols=${symbol}`,
      //       {
      //         method: "GET",
      //         headers: { accept: "application/json" },
      //       }
      //     ).then((res) => res.json())
      //   );

      //   const prices = await Promise.all(pricePromises);

      // Combine balance and price data
      const enrichedTokens: TokenInfo[] = balances.tokenBalances.map(
        (token, index) => {
          const tokenInfo = Object.values(TOKENS)[index];
          //   const price = prices[index]?.tokens?.[0]?.price || 0;
          const balance =
            token.tokenBalance === null
              ? 0
              : Number(
                  BigInt(token.tokenBalance) / BigInt(10 ** tokenInfo.decimals)
                );

          return {
            ...tokenInfo,
            balance,
            // price,
            // value: balance * price,
          };
        }
      );

      const portfolioValue = enrichedTokens.reduce(
        (acc, token) => acc + token.value,
        0
      );

      setTokenData(enrichedTokens);
      setTotalValue(portfolioValue);
      setLoading(false);
    } catch (err: any) {
      console.error("Error fetching token data:", err);
      setError(err.message || "Something went wrong");
      setLoading(false);
    }
  };

  // Mock historical data for the chart
  const chartData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(
      Date.now() - (29 - i) * 24 * 60 * 60 * 1000
    ).toLocaleDateString(),
    value: totalValue * (1 + Math.random() * 0.1 - 0.05),
  }));

  return (
    <div className="w-full max-w-4xl p-6 space-y-6">
      {/* <pre>{JSON.stringify(tokenData, null, 2)}</pre> */}
      {/* Warning Alert */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Note: Token prices are fetched from Alchemy's price API. Values may be
          delayed or differ from other sources.
        </AlertDescription>
      </Alert>

      {/* Portfolio Value Card */}
      <Card className="w-full bg-white">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl font-normal text-gray-800">
              Token Portfolio Value
            </CardTitle>
          </div>
          {loading ? (
            <Skeleton className="h-8 w-32 mt-2" />
          ) : (
            <div className="text-4xl font-normal text-gray-900 mt-2">
              $
              {totalValue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          )}
          <div className="text-sm text-gray-500 mt-1">Last 30 days</div>
        </CardHeader>
        <CardContent>
          <div className="h-48 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818CF8" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#818CF8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" hide={true} />
                <YAxis hide={true} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                  formatter={(value) => [
                    `$${value.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`,
                    "Value",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#818CF8"
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Token List Card */}
      <Card className="w-full bg-white">
        <CardHeader>
          <CardTitle className="text-xl font-normal">Your Tokens</CardTitle>
        </CardHeader>
        <CardContent>
          {loading
            ? Array(3)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-4 border-b"
                  >
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                    <Skeleton className="h-4 w-[100px]" />
                  </div>
                ))
            : tokenData?.map((token) => (
                <div
                  key={token.symbol}
                  className="flex items-center justify-between py-4 border-b"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center text-2xl">
                      {token.icon}
                    </div>
                    <div>
                      <div className="font-medium">{token.symbol}</div>
                      <div className="text-sm text-gray-500">
                        {token.balance.toLocaleString(undefined, {
                          minimumFractionDigits: token.symbol === "ETH" ? 4 : 2,
                          maximumFractionDigits: token.symbol === "ETH" ? 4 : 2,
                        })}{" "}
                        {token.symbol}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      $
                      {token.value.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                    <div className="text-sm text-gray-500">
                      $
                      {token.price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      / {token.symbol}
                    </div>
                  </div>
                </div>
              ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default TokenPortfolio;
