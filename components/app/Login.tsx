"use client";
import React, { useEffect } from "react";
import { useAuthModal } from "@account-kit/react";
import { Button } from "@/components/ui/button";

export default function Login() {
  const { openAuthModal } = useAuthModal();

  useEffect(() => {
    openAuthModal();
  }, [openAuthModal]);

  return (
    <Button
      className="absolute"
      style={{
        color: "white",
        backgroundColor: "#000000",
        borderRadius: "42px",
        top: "14%",
        fontSize: "18px",
        fontWeight: "400",
        padding: "24px 28px",
        transform: "translateY(-50%)",
        zIndex: 10,
      }}
      onClick={() => {
        try {
          openAuthModal();
        } catch (error) {
          console.log(error);
        }
      }}
    >
      Login
    </Button>
  );
}
