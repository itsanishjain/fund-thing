"use client";

import { useSignerStatus } from "@account-kit/react";
import Login from "@/components/app/Login";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const signerStatus = useSignerStatus();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!signerStatus.isInitializing) {
      setIsLoading(false);
    }
  }, [signerStatus.isInitializing]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full h-full relative">
      <Login />
    </div>
  );
}
