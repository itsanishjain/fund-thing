"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useUser } from "@account-kit/react";
import { truncateAddress } from "@/app/lib/utils";

const BankingDashboard = () => {
  const user = useUser();
  // Sample data for the last 30 days
  const chartData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(
      Date.now() - (29 - i) * 24 * 60 * 60 * 1000
    ).toLocaleDateString(),
    balance: Math.random() * 1000, // Random balance for demonstration
  }));

  return (
    <div className="flex flex-col md:flex-row p-6 justify-between space-x-4">
      <Card className="w-full bg-white">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl font-normal text-gray-800">
              Willi balance
            </CardTitle>
            <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1">
              <svg
                className="h-3 w-3 text-blue-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </div>
          <div className="text-4xl font-normal text-gray-900 mt-2">$0.00</div>
          <div className="text-sm text-gray-500 mt-1">Last 30 days</div>
        </CardHeader>
        <CardContent>
          <div className="h-48 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
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
                  formatter={(value: number) => [
                    `$${value.toFixed(2)}`,
                    "Balance",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="#818CF8"
                  fillOpacity={1}
                  fill="url(#colorBalance)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <span className="text-green-500">↑</span>
              <span>$0</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-red-500">↓</span>
              <span>-$0</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full bg-white">
        <CardHeader>
          <CardTitle className="text-xl font-normal">Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between py-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <div className="font-medium">
                  Savings {truncateAddress(user?.address || "")}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium">$0.00</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BankingDashboard;
