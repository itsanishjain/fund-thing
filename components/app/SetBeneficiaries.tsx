"use client";
import React from "react";
import {
  type UseSendUserOperationResult,
  useSendUserOperation,
  useSmartAccountClient,
} from "@account-kit/react";

import willJson from "@/app/abi/Will.json";

import { encodeFunctionData, Address } from "viem";
import { SALT } from "@/app/lib/constants";
import { useWillStore } from "@/app/store/willStore";

import { useToast } from "../ui/use-toast";

const willAbi = willJson.abi;

export default function SetBeneficiaries() {
  const { toast } = useToast();

  const { client } = useSmartAccountClient({
    type: "MultiOwnerLightAccount",
    policyId: process.env.NEXT_PUBLIC_POLICY_ID!,
    accountParams: {
      salt: BigInt(SALT),
    },
  });

  const { getWillAddress } = useWillStore();
  const willAddress = client?.account.address
    ? getWillAddress(client.account.address)
    : null;

  const { sendUserOperation, isSendingUserOperation, error } =
    useSendUserOperation({
      client,
      waitForTxn: true,
      onSuccess: ({ hash, request }) => {
        console.log("hash", hash);
        console.log("request", request);

        toast({
          title: "Success",
          description: "Beneficiaries have been successfully set.",
        });
      },
      onError: (error) => {
        console.error(error);

        toast({
          title: "Error",
          description: "Failed to set beneficiaries. Please try again.",
          variant: "destructive",
        });
      },
    });

  const buttonPressed = async () => {
    if (!willAddress) {
      console.error("No Will contract address found");
      return;
    }

    // Parameters to edit
    const beneficiaries: Address[] = [
      "0xF15120b66318d73c25c5Bf6c0aE111B637C9B64c",
    ];

    try {
      const encodedWillData = encodeFunctionData({
        abi: willAbi,
        functionName: "setBeneficiaries",
        args: [beneficiaries],
      });

      sendUserOperation({
        uo: {
          target: willAddress as `0x${string}`,
          data: encodedWillData,
          value: BigInt(0),
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <button
        className="bg-slate-700 text-white w-40 px-4 py-2 rounded-md"
        onClick={async () => {
          buttonPressed();
        }}
        disabled={isSendingUserOperation || !willAddress}
      >
        {isSendingUserOperation ? "Sending..." : "Set Beneficiaries"}
      </button>
      {error && <div>{error.message}</div>}
    </div>
  );
}
