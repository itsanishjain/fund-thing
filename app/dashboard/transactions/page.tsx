"use client";

import BankingDashboard from "@/components/app/BankingDashboard";
import NFTPortfolio from "@/components/app/NFTPortfolio";
import TokenPortfolio from "@/components/app/TokenPortfolio";
import AuthWrapper from "@/components/app/AuthWrapper";
import { useUser } from "@account-kit/react";

export default function Page() {
  const user = useUser();
  return (
    <AuthWrapper>
      <>
        <BankingDashboard />
        <NFTPortfolio walletAddress={user?.address || ""} />
        <TokenPortfolio walletAddress="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" />
      </>
    </AuthWrapper>
  );
}
