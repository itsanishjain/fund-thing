"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EllipsisVertical, Search, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddBeneficiaryModal from "@/components/app/AddBeneficiaryModal";
import { useToast } from "../ui/use-toast";
import ClaimAccount from "./ClaimAccount";
import { useAuthModal, useSignerStatus, useUser } from "@account-kit/react";

interface Beneficiary {
  id: string;
  walletAddress: string;
  shortAddress: string;
  trustPercentage: number;
  email: string;
  relationship: string;
  phoneNumber: string;
  status: "Active" | "Inactive";
}

const BeneficiaryList = () => {
  const toast = useToast();
  const user = useUser();

  const [isAddBeneficiaryModalOpen, setIsAddBeneficiaryModalOpen] =
    useState(false);

  const [beneficiaries, setBeneficiaries] = useState();

  // const beneficiaries: Beneficiary[] = [
  //   {
  //     id: "1",
  //     walletAddress: "proofofwill.eth",
  //     shortAddress: "0xd0f4...f743",
  //     trustPercentage: 40,
  //     email: "willi@alchemy.com",
  //     relationship: "Brother",
  //     phoneNumber: "(282)382-2716",
  //     status: "Active",
  //   },
  //   {
  //     id: "2",
  //     walletAddress: "legacyholder.eth",
  //     shortAddress: "0xa1b2...c3d4",
  //     trustPercentage: 60,
  //     email: "legacy@alchemy.com",
  //     relationship: "Sister",
  //     phoneNumber: "(123)456-7890",
  //     status: "Inactive",
  //   },
  //   {
  //     id: "3",
  //     walletAddress: "futuretrust.eth",
  //     shortAddress: "0x9e8f...7a6b",
  //     trustPercentage: 75,
  //     email: "future@alchemy.com",
  //     relationship: "Friend",
  //     phoneNumber: "(987)654-3210",
  //     status: "Active",
  //   },
  // ];

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

  return (
    <>
      <pre>{JSON.stringify(beneficiaries, null, 2)}</pre>
      <div className="space-y-4">
        <div className="flex items-center justify-between h-10">
          <h2 className="text-2xl font-semibold font-['Inter'] leading-none">
            Beneficiaries
          </h2>
          <div className="flex items-center gap-4">
            <div className="relative flex items-center">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 text-muted-foreground -translate-y-1/2" />
              <Input placeholder="Filter by address or ENS" className="pl-8" />
            </div>
            <Button
              className="gap-2"
              onClick={() => setIsAddBeneficiaryModalOpen(true)}
            >
              <UserPlus className="h-4 w-4" />
              Add Beneficiary
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full px-6 py-4">
        <div className="rounded-lg border border-gray-100 overflow-hidden bg-white">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-100">
                <TableHead className="w-[300px] text-gray-600 font-medium">
                  Beneficiary
                </TableHead>
                <TableHead className="w-[200px] text-gray-600 font-medium">
                  Trust percentage
                </TableHead>
                <TableHead className="w-[250px] text-gray-600 font-medium">
                  Email
                </TableHead>
                <TableHead className="w-[200px] text-gray-600 font-medium">
                  Relationship
                </TableHead>
                <TableHead className="w-[200px] text-gray-600 font-medium">
                  Phone Number
                </TableHead>
                <TableHead className="w-[150px] text-gray-600 font-medium">
                  Will Status
                </TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            {/* <TableBody>
              {beneficiaries.map((beneficiary) => (
                <TableRow
                  key={beneficiary.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex-shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-gray-900 font-medium">
                          {beneficiary.walletAddress}
                        </span>
                        <span className="text-sm text-gray-500">
                          {beneficiary.shortAddress}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-900 font-medium">
                    {beneficiary.trustPercentage}%
                  </TableCell>
                  <TableCell className="text-gray-900">
                    {beneficiary.email}
                  </TableCell>
                  <TableCell className="text-gray-900">
                    {beneficiary.relationship}
                  </TableCell>
                  <TableCell className="text-gray-900">
                    {beneficiary.phoneNumber}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        beneficiary.status === "Active"
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      <ClaimAccount id={beneficiary.id} />
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-500 hover:text-gray-700"
                    >
                      <EllipsisVertical className="h-5 w-5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody> */}
          </Table>
        </div>
      </div>
      <AddBeneficiaryModal
        isOpen={isAddBeneficiaryModalOpen}
        onClose={() => setIsAddBeneficiaryModalOpen(false)}
      />
    </>
  );
};

export default BeneficiaryList;
