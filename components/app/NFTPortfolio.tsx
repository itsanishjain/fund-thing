//@ts-nocheck

"use client";
import React, { useState, useEffect } from "react";
import { Network, Alchemy, NftFilters } from "alchemy-sdk";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const settings = {
  apiKey: env.NEXT_PUBLIC_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

const NFTPortfolio = ({ walletAddress = "anishjain.eth" }) => {
  const [nftData, setNftData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalValue, setTotalValue] = useState(0);

  useEffect(() => {
    fetchNFTData();
  }, [walletAddress]);

  const fetchNFTData = async () => {
    try {
      setLoading(true);
      // Fetch NFTs for the wallet
      const nftsForOwner = await alchemy.nft.getNftsForOwner(walletAddress, {
        excludeFilters: [NftFilters.SPAM, NftFilters.AIRDROPS],
      });

      // Fetch price data for each NFT
      const enrichedNFTs = await Promise.all(
        nftsForOwner.ownedNfts.map(async (nft) => {
          try {
            // Fetch floor price for the collection
            const priceData = await alchemy.nft.getFloorPrice(
              nft.contract.address
            );

            // Calculate estimated value (using OpenSea floor price if available)
            const estimatedValue = priceData.openSea?.floorPrice
              ? Number(priceData.openSea.floorPrice)
              : priceData.looksRare?.floorPrice
              ? Number(priceData.looksRare.floorPrice)
              : 0;

            return {
              ...nft,
              floorPrice: estimatedValue,
              estimatedValue: estimatedValue,
            };
          } catch (err) {
            console.error(
              `Error fetching price for NFT ${nft.contract.address}:`,
              err
            );
            return {
              ...nft,
              floorPrice: 0,
              estimatedValue: 0,
            };
          }
        })
      );

      // Calculate total portfolio value
      const portfolioValue = enrichedNFTs.reduce(
        (acc, nft) => acc + nft.estimatedValue,
        0
      );

      setNftData(enrichedNFTs);
      setTotalValue(portfolioValue);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching NFT data:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  // Generate chart data for the last 30 days (mock data for demonstration)
  const chartData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(
      Date.now() - (29 - i) * 24 * 60 * 60 * 1000
    ).toLocaleDateString(),
    value: totalValue * (1 + Math.random() * 0.1 - 0.05), // Simulate price fluctuation
  }));

  if (error) {
    return (
      <Card className="w-full bg-white">
        <CardContent className="p-6">
          <div className="text-red-500">Error loading NFT data: {error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col md:flex-row space-x-0 md:space-x-4">
      {/* <pre>{JSON.stringify(nftData, null, 2)}</pre> */}
      {/* Portfolio Value Card */}
      <Card className="w-full bg-white">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl font-normal text-gray-800">
              NFT Portfolio Value
            </CardTitle>
          </div>
          {loading ? (
            <Skeleton className="h-8 w-32 mt-2" />
          ) : (
            <div className="text-4xl font-normal text-gray-900 mt-2">
              Ξ {totalValue.toFixed(2)}
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
                  formatter={(value) => [`Ξ ${value.toFixed(2)}`, "Value"]}
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

      {/* NFT List Card */}
      <Card className="w-full bg-white">
        <CardHeader>
          <CardTitle className="text-xl font-normal">Your NFTs</CardTitle>
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
            : nftData?.map((nft, index) => (
                <div
                  key={`${nft.contract.address}-${nft.tokenId}-${index}`}
                  className="flex items-center justify-between py-4 border-b"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-full overflow-hidden">
                      {nft.image?.[0]?.cachedUrl ? (
                        <img
                          src="/api/placeholder/48/48"
                          alt={nft.title || "NFT"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          NFT
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium">
                        {nft.title || "Untitled NFT"}
                      </div>
                      <div className="text-sm text-gray-500">
                        Token ID: {nft.tokenId.slice(0, 6)}...
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      Ξ {nft.estimatedValue.toFixed(3)}
                    </div>
                    <div className="text-sm text-gray-500">Floor Price</div>
                  </div>
                </div>
              ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default NFTPortfolio;
