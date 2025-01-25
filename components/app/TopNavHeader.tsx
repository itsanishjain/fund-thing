"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSignerStatus, useUser, useAuthModal, useLogout } from "@account-kit/react";
import { truncateAddress } from "@/app/lib/utils";
import UserMenu from "@/components/app/UserMenu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import SetPeriod from "@/components/app/SetPeriod";
import { EllipsisVertical } from "lucide-react";


const TopNavHeader = () => {
  const signerStatus = useSignerStatus();
  const user = useUser();
  const { openAuthModal } = useAuthModal();
  const { logout } = useLogout();
  return (
    <div className="w-full bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Brand */}
          <Link href="/">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-semibold">Willi</h1>
            </div>
          </Link>

          {/* Right side - Account & Actions */}
          <div className="flex items-center space-x-4">
            {/* Account Button */}
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 rounded-full bg-gray-200" />
              {user?.address ? (
                truncateAddress(user?.address || "")
              ) : (
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={openAuthModal}>
                  Login
                </Button>
              )}
            </div>

            {/* Menu Button with Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100 transition-colors focus:outline-none [&[data-state=open]]:bg-transparent [&[data-state=open]]:ring-0"
                  style={{ outline: 'none' }}
                >
                  <EllipsisVertical className="h-5 w-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {user && (
                  <>
                    <DropdownMenuItem className="cursor-pointer">
                      <Link 
                        href={`https://rocketship.lemonsqueezy.com/buy/4a01d680-ec31-4d1c-8dd1-66af668b5ce7?checkout[custom][user_id]=${user.address}`}
                        className="w-full"
                      >
                        Subscribe
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      Set Period
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-1" />
                    <DropdownMenuItem 
                      className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                      onClick={() => logout()}
                    >
                      Log out
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNavHeader;
