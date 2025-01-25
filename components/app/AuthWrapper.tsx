"use client";

import { Button } from "@/components/ui/button";
import { useAuthModal, useSignerStatus, useUser } from "@account-kit/react";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const user = useUser();
  const { openAuthModal } = useAuthModal();
  const signerStatus = useSignerStatus();

  const addUser = async (body: any) => {
    fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  };

  useEffect(() => {
    if (user) {
      const body = { email: user.email, walletAddress: user.address };
      addUser(body);
      console.log(body);
    }
  }, [user]);

  return (
    <>
      {signerStatus.isInitializing ? (
        <Loader className="animate-spin w-6 h-6" />
      ) : user ? (
        <div className="flex flex-col gap-2 p-2">{children}</div>
      ) : (
        <main className="flex min-h-screen flex-col items-center  justify-center text-center">
          {pathname === "/" ? (
            children
          ) : (
            <Button onClick={openAuthModal}>Login</Button>
          )}
        </main>
      )}
    </>
  );
}
