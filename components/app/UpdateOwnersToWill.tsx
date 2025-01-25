"use client";
import React from "react";
import {
  type UseSendUserOperationResult,
  useSendUserOperation,
  useSmartAccountClient,
} from "@account-kit/react";

import { bytecode, abi as willAbi } from "@/app/abi/Will.json";
import { encodeFunctionData, Address } from "viem";
import { SALT } from "@/app/lib/constants";
import { useWillStore } from "@/app/store/willStore";
import multiOwnerLightAccountJson from "@/app/abi/MultiOwnerLightAccount.json";

const multiOwnerLightAccountAbi = multiOwnerLightAccountJson.abi;

export default function UpdateOwnersToWill() {
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

    try {
      const encodedUpdateOwnership = encodeFunctionData({
        abi: multiOwnerLightAccountAbi,
        functionName: "updateOwners",
        args: [[willAddress], []],
      });

      sendUserOperation({
        uo: {
          target: client?.account.address as Address,
          data: encodedUpdateOwnership,
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
        {isSendingUserOperation ? "Sending..." : "Update Owners To Will"}
      </button>
      {error && <div>{error.message}</div>}
    </div>
  );
}
