"use client";
import React from "react";
import {
  type UseSendUserOperationResult,
  useSendUserOperation,
  useSmartAccountClient,
} from "@account-kit/react";

import { Address } from "viem";
import { bytecode, abi as willAbi } from "@/app/abi/Will.json";
import { createWalletClient, encodeFunctionData, encodeDeployData } from "viem";
import { SALT } from "@/app/lib/constants";
import { useWillStore } from "@/app/store/willStore";

export default function WillInfo() {
  const { client } = useSmartAccountClient({
    type: "MultiOwnerLightAccount",
    policyId: process.env.NEXT_PUBLIC_POLICY_ID!,
    accountParams: {
      salt: BigInt(SALT),
    },
  });
  const getWillAddress = useWillStore((state) => state.getWillAddress);
  const [willData, setWillData] = React.useState({
    owner: "",
    smartAccount: "",
    lastActiveTime: BigInt(0),
    proofOfLifePeriod: BigInt(0),
    paused: false,
  });
  const [beneficiaries, setBeneficiaries] = React.useState<string[]>([]);
  const willAddress = client?.account.address
    ? getWillAddress(client.account.address)
    : null;
  // Main will data fetch
  React.useEffect(() => {
    async function fetchWillData() {
      if (!client?.account?.address) return;
      if (!willAddress) return;

      try {
        const data = {
          owner: (await client.readContract({
            abi: willAbi,
            address: willAddress as Address,
            functionName: "owner",
          })) as string,
          smartAccount: (await client.readContract({
            abi: willAbi,
            address: willAddress as Address,
            functionName: "smartAccount",
          })) as string,
          lastActiveTime: (await client.readContract({
            abi: willAbi,
            address: willAddress as Address,
            functionName: "lastActiveTime",
          })) as bigint,
          proofOfLifePeriod: (await client.readContract({
            abi: willAbi,
            address: willAddress as Address,
            functionName: "proofOfLifePeriod",
          })) as bigint,
          paused: (await client.readContract({
            abi: willAbi,
            address: willAddress as Address,
            functionName: "paused",
          })) as boolean,
        };

        setWillData(data);
      } catch (error) {
        console.error("Error fetching will data:", error);
      }
    }

    fetchWillData();
  }, [client?.account?.address, getWillAddress]);

  // Separate beneficiaries fetch
  React.useEffect(() => {
    async function fetchBeneficiaries() {
      if (!client?.account?.address) return;
      const willAddress = getWillAddress(client.account.address);
      if (!willAddress) return;

      try {
        const beneficiariesData = await client.readContract({
          abi: willAbi,
          address: willAddress as Address,
          functionName: "getBeneficiaries",
        });
        console.log("beneficiariesData", beneficiariesData);

        setBeneficiaries(beneficiariesData as string[]);
      } catch (error) {
        console.error("Error fetching beneficiaries:", error);
      }
    }

    fetchBeneficiaries();
  }, [client?.account?.address, getWillAddress]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Will Contract Info</h2>
      <div className="space-y-2">
        <p>Will Contract: {willAddress}</p>

        <p>Owner: {willData.owner}</p>
        <p>Smart Account: {willData.smartAccount}</p>
        <p>
          Last Active:{" "}
          {new Date(Number(willData.lastActiveTime) * 1000).toLocaleString()}
        </p>
        <p>
          Proof of Life Period: {willData.proofOfLifePeriod.toString()} seconds
        </p>
        <p>Contract Status: {willData.paused ? "Paused" : "Active"}</p>
        <p>Beneficiaries: {beneficiaries.join(", ")}</p>
      </div>
    </div>
  );
}
