"use client";

import { useAuthModal, useSignerStatus, useUser } from "@account-kit/react";
import AuthWrapper from "@/components/app/AuthWrapper";
import Login from "@/components/app/Login";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const user = useUser();
  const { openAuthModal } = useAuthModal();
  const signerStatus = useSignerStatus();
  const [isDashboard, setIsDashboard] = useState(false);
  // const router = useRouter();

  useEffect(() => {
    const willStorage = localStorage.getItem("will-storage");
    if (willStorage) {
      setIsDashboard(true);
    }
  }, []);

  if (signerStatus.isInitializing && user) {
    return <Loader className="animate-spin w-6 h-6" />;
  }

  return (
    <AuthWrapper>
      <div className="flex flex-col items-center w-full h-full relative">
        <Login />
      </div>
    </AuthWrapper>
  );
}
