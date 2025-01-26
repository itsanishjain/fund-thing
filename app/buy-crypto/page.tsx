"use client";

import { CryptoOnramp } from "@/components/crypto/CryptoOnramp";
import { useLogout } from "@account-kit/react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

export default function BuyCryptoPage() {
  const { logout, isLoggingOut } = useLogout({
    onSuccess: () => {
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
      router.push("/");
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error logging out",
        description: "There was a problem logging you out",
      });
    },
  });
  const { toast } = useToast();
  const router = useRouter();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="container max-w-5xl py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">fund thing</h1>
        <Button onClick={handleLogout} disabled={isLoggingOut}>
          {isLoggingOut ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : null}
          Logout
        </Button>
      </div>
      <CryptoOnramp />
    </div>
  );
}
