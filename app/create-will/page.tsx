"use client";

import { Button } from "@/components/ui/button";
import { Bell, Users, Search, Check, MoreVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import BeneficiaryList from "@/components/app/BeneficiaryList";
import { useAuthModal, useSignerStatus, useUser } from "@account-kit/react";
import { Loader } from "lucide-react";
import { useState } from "react";

import Alive from "@/components/app/Alive";
import CreateWill from "@/components/app/CreateWill";
import SetSmartAccount from "@/components/app/SetSmartAccount";
import SetBeneficiaries from "@/components/app/SetBeneficiaries";
import ClaimAccount from "@/components/app/ClaimAccount";
import AccountInfo from "@/components/app/AccountInfo";
import WillInfo from "@/components/app/WillInfo";

export default function Home() {
  const user = useUser();
  const { openAuthModal } = useAuthModal();
  const signerStatus = useSignerStatus();
  const [activeTab, setActiveTab] = useState<"beneficiaries" | "notifications">(
    "beneficiaries"
  );

  if (signerStatus.isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader className="animate-spin w-6 h-6" />
      </div>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen flex-col items-center p-24 gap-4 justify-center text-center">
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={openAuthModal}
        >
          Login
        </Button>
      </main>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <CreateWill></CreateWill>
    </div>
  );
}
