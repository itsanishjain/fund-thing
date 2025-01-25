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

export default function AccountInfo() {
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
  const willAddress = client?.account.address
    ? getWillAddress(client.account.address)
    : null;
  // Main will data fetch

  const [owners, setOwners] = React.useState<
    readonly `0x${string}`[] | undefined
  >(undefined);

  const fetchOwners = async () => {
    const ownerAddresses = await client?.account?.getOwnerAddresses();
    setOwners(ownerAddresses);
    console.log("smartAccountOwners", ownerAddresses);
  };
  React.useEffect(() => {
    fetchOwners();
  }, [client?.account?.address]);

  return (
    <div className="space-y-4">
      <p>Users's Smart Account Address: {client?.account?.address}</p>

      <p>Smart Account Owners: {owners}</p>
    </div>
  );
}
