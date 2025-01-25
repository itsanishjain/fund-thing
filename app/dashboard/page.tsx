//@ts-nocheck

"use client";

import React, { useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bell, Users, Search, Check, MoreVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import BeneficiaryList from "@/components/app/BeneficiaryList";
import BeneficiariesTable from "@/components/app/BeneficiariesTable";
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
import AddBeneficiaryModal from "@/components/app/AddBeneficiaryModal";

export default function Home() {
  const user = useUser();
  const { openAuthModal } = useAuthModal();
  const signerStatus = useSignerStatus();
  const [activeTab, setActiveTab] = useState<"beneficiaries" | "notifications">(
    "beneficiaries"
  );
  const [isAddBeneficiaryModalOpen, setIsAddBeneficiaryModalOpen] =
    useState(false);

  const [beneficiaries, setBeneficiaries] = useState();

  const fetchBeni = async () => {
    const r = await fetch(`/api/beneficiaries/?address=${user?.address}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const d = await r.json();
    setBeneficiaries(d.data);
  };

  useEffect(() => {
    fetchBeni();
  }, []);

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
      {/* Life Status Section */}
      <div className="bg-white rounded-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold font-['Inter']">
              Life Status
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>Active</span>
            </div>
          </div>
          {/* <Button className="bg-blue-600 text-white" onClick={() => {}}>
            Confirm Activity
          </Button> */}
          <Alive />
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <p className="text-gray-600">Last ping date</p>
            <p className="text-lg font-medium">November 14, 2024</p>
          </div>
          <div>
            <p className="text-gray-600">Next ping date</p>
            <p className="text-lg font-medium">January 14, 2025</p>
          </div>
        </div>
      </div>

      {/* Beneficiaries Section */}
      <div className="bg-white rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <div className="w-[400px] bg-gray-100/50 p-1 rounded-full flex">
              <button
                onClick={() => setActiveTab("beneficiaries")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-full transition-all ${
                  activeTab === "beneficiaries"
                    ? "bg-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Users className="h-4 w-4" />
                Beneficiaries
              </button>
              <button
                onClick={() => setActiveTab("notifications")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-full transition-all ${
                  activeTab === "notifications"
                    ? "bg-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Bell className="h-4 w-4" />
                Notifications
              </button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {activeTab === "beneficiaries" ? (
          <BeneficiariesTable beneficiaries={beneficiaries} />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between h-10">
              <h2 className="text-2xl font-semibold font-['Inter'] leading-none">
                Notifications
              </h2>
              <div className="flex items-center gap-4">
                <div className="relative flex items-center">
                  <Search className="absolute left-2.5 top-1/2 h-4 w-4 text-muted-foreground -translate-y-1/2" />
                  <Input
                    placeholder="Filter through your notifications"
                    className="pl-8 font-['Inter']"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="bg-white font-['Inter']">
                    All
                  </Button>
                  <Button variant="outline" className="bg-white font-['Inter']">
                    Unread
                  </Button>
                </div>
              </div>
            </div>

            {/* Notification Items */}
            <div className="space-y-4">
              <div className="flex items-start justify-between p-4 bg-white rounded-lg border border-gray-100">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-900 font-medium font-['Inter']">
                      Confirmed
                    </span>
                    <span className="text-sm text-gray-500 font-['Inter']">
                      09 Jul 2023 21:05
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 font-['Inter']">
                    1 month
                  </span>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-start justify-between p-4 bg-white rounded-lg border border-gray-100">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Bell className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-900 font-medium font-['Inter']">
                      Confirm Activity
                    </span>
                    <span className="text-sm text-gray-500 font-['Inter']">
                      09 Jul 2023 21:05
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 font-['Inter']">
                    4 months
                  </span>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hidden but maintained for functionality */}
      <div className="hidden">
        <CreateWill />
        <SetSmartAccount />
        {/* <ClaimAccount /> */}
        <AccountInfo />
        <WillInfo />
      </div>

      <AddBeneficiaryModal
        isOpen={isAddBeneficiaryModalOpen}
        onClose={() => setIsAddBeneficiaryModalOpen(false)}
      />
    </div>
  );
}
