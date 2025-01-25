"use client";

import { Button } from "@/components/ui/button";
import BeneficiaryList from "@/components/app/BeneficiaryList";
import SubscriptionStatus from "@/components/app/SubscriptionStatus";
import {
  useAuthModal,
  useLogout,
  useSignerStatus,
  useUser,
} from "@account-kit/react";
import { useAuthenticate } from "@account-kit/react";
import { Loader } from "lucide-react";

import { useEffect } from "react";

export default function EmailConfirmation({
  searchParams,
}: {
  searchParams: { uuid: string };
}) {
  const user = useUser();
  const { openAuthModal, isOpen, closeAuthModal } = useAuthModal();
  const signerStatus = useSignerStatus();
  const { logout } = useLogout();
  const uuid = searchParams.uuid;

  const addUser = async (body: any) => {
    const response = await fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  };

  useEffect(() => {
    if (user && !isOpen) {
      // const uid = v4();
      const body = {
        email: user.email,
        walletAddress: user.address,
        uuid: uuid,
        status: "Pending",
      };
      addUser(body);
      console.log(body);
      // window.localStorage.setItem("WILLI_UID", uid);
    }
  }, [user]);

  if (!uuid) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700">
            Oops! It seems like the page is missing a valid UUID.
          </p>
          <p className="text-gray-700">Please check the link and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {signerStatus.isInitializing ? (
        <Loader className="animate-spin w-6 h-6" />
      ) : user ? (
        <div className="flex flex-col gap-2 p-2">
          {/* <SubscriptionStatus />
          <BeneficiaryList /> */}
          {/* {uuid} */}
          <div className="bg-green-100 p-4 rounded-lg shadow-md text-center">
            <h2 className="text-xl font-semibold text-green-600 mb-2">
              Congratulations!
            </h2>
            <p className="text-gray-700">
              You are now a beneficiary. Welcome aboard!
            </p>
          </div>
        </div>
      ) : (
        <main className="flex min-h-screen flex-col items-center p-24 gap-4 justify-center text-center">
          <Button onClick={openAuthModal}>Login</Button>
        </main>
      )}
    </>
  );
}
