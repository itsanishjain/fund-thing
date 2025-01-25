"use client";
import React from "react";
import {
  type UseSendUserOperationResult,
  useSendUserOperation,
  useSmartAccountClient,
} from "@account-kit/react";

import willJson from "@/app/abi/Will.json";
import { encodeFunctionData } from "viem";
import { SALT } from "@/app/lib/constants";
import { useWillStore } from "@/app/store/willStore";

const willAbi = willJson.abi;
export default function SetPeriod() {
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
      },
      onError: (error) => {
        console.error(error);
      },
    });

  const buttonPressed = async () => {
    if (!willAddress) {
      console.error("No Will contract address found");
      return;
    }

    // Parameters to edit
    const period = 1;

    try {
      const encodedWillData = encodeFunctionData({
        abi: willAbi,
        functionName: "setPeriod",
        args: [period],
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
        className="bg-amber-700 text-white w-40 px-4 py-2 rounded-md"
        onClick={async () => {
          buttonPressed();
        }}
        disabled={isSendingUserOperation || !willAddress}
      >
        {isSendingUserOperation ? "Sending..." : "Set Period"}
      </button>
      {error && <div>{error.message}</div>}
    </div>
  );
}
