"use client";
import React, { useEffect } from "react";
import { useAuthModal, useSignerStatus, useUser } from "@account-kit/react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function Login() {
  const { openAuthModal } = useAuthModal();
  const router = useRouter();
  const user = useUser();
  const signerStatus = useSignerStatus();

  useEffect(() => {
    if (user) {
      router.push("/buy-crypto"); // Redirect to the dashboard or another page if the user is logged in
    } else if (!signerStatus.isInitializing) {
      openAuthModal(); // Open auth modal by default if user is not logged in
    }
  }, [user, router, openAuthModal, signerStatus.isInitializing]);

  if (signerStatus.isInitializing) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Button
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      style={{
        color: "white",
        backgroundColor: "#000000",
        borderRadius: "42px",
        fontSize: "18px",
        fontWeight: "400",
        padding: "24px 28px",
        zIndex: 10,
      }}
      onClick={openAuthModal}
    >
      Login
    </Button>
  );
}
