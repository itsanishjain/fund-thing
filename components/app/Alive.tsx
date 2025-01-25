"use client";
import React from "react";
import {
  type UseSendUserOperationResult,
  useSendUserOperation,
  useSmartAccountClient,
} from "@account-kit/react";
import { useToast } from "@/components/ui/use-toast";

import willJson from "@/app/abi/Will.json";
import { createWalletClient, encodeFunctionData, encodeDeployData } from "viem";
import { SALT } from "@/app/lib/constants";
import { useWillStore } from "@/app/store/willStore";
import { Button } from "@/components/ui/button";

export default function Alive() {
  const { client } = useSmartAccountClient({
    type: "MultiOwnerLightAccount",
    policyId: process.env.NEXT_PUBLIC_POLICY_ID!,
    accountParams: {
      salt: BigInt(SALT),
    },
  });

  const { toast } = useToast();

  const willAbi = willJson.abi;

  const { getWillAddress } = useWillStore();
  const willAddress = client?.account.address
    ? getWillAddress(client.account.address)
    : null;

  const {
    sendUserOperation,
    isSendingUserOperation,
    error,
    sendUserOperationAsync,
  } = useSendUserOperation({
    client,
    // optional parameter that will wait for the transaction to be mined before returning
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
      const encodedWillData = encodeFunctionData({
        abi: willAbi,
        functionName: "alive",
        args: [],
      });

      const result = await sendUserOperationAsync({
        uo: {
          target: willAddress as `0x${string}`,
          data: encodedWillData,
          value: BigInt(0),
        },
      });

      toast({
        title: "Success",
        description: "You have proven to be alive",
        variant: "default",
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="text-center flex items-center flex-row justify-center">
      <Button
        className="bg-blue-600 text-white rounded-md w-40 h-10 items-center justify-center"
        onClick={async () => {
          toast({
            title: "Sending Transaction",
            description: "Proving you are alive",
            variant: "default",
          });
          buttonPressed();
        }}
      >
        Confirm Activity
      </Button>
    </div>
  );
}
