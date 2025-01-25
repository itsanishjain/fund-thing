import React, { useState, useMemo } from "react";
import {
  Search,
  UserPlus,
  EllipsisVertical,
  Mail,
  Phone,
  Percent,
  Users,
  Wallet,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import AddBeneficiaryModal from "@/components/app/AddBeneficiaryModal";
import SetBeneficiaries from "@/components/app/SetBeneficiaries";

interface Beneficiary {
  id: string;
  accountWalletAddress: string;
  createdAt: string;
  trustPercentage: number;
  email: string;
  phoneNumber: string;
  relationship: string;
  status: "Active" | "Pending" | "Not Claimed";
}

interface BeneficiariesTableProps {
  beneficiaries: Beneficiary[];
  onAddBeneficiary: () => void;
}

const BeneficiariesTable: React.FC<BeneficiariesTableProps> = ({
  beneficiaries = [],
  onAddBeneficiary,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Format wallet address for display
  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Filter beneficiaries based on search query
  const filteredBeneficiaries = useMemo(() => {
    return beneficiaries.filter(
      (b) =>
        b.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.accountWalletAddress
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        b.relationship.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [beneficiaries, searchQuery]);

  // Calculate total allocation percentage
  const totalAllocation = useMemo(() => {
    return beneficiaries.reduce((sum, b) => sum + Number(b.trustPercentage), 0);
  }, [beneficiaries]);

  const [isAddBeneficiaryModalOpen, setIsAddBeneficiaryModalOpen] =
    useState(false);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold font-['Inter'] leading-none">
              Beneficiaries
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Total Allocation: {totalAllocation}%
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 text-gray-400 -translate-y-1/2" />
              <Input
                placeholder="Search beneficiaries..."
                className="pl-8 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              className="gap-2"
              onClick={() => setIsAddBeneficiaryModalOpen(true)}
            >
              <UserPlus className="h-4 w-4" />
              Add Beneficiary
            </Button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-[300px] font-semibold">
                Beneficiary
              </TableHead>
              <TableHead className="w-[150px] font-semibold">Trust %</TableHead>
              <TableHead className="w-[250px] font-semibold">
                Contact Info
              </TableHead>
              <TableHead className="w-[200px] font-semibold">
                Relationship
              </TableHead>
              <TableHead className="w-[150px] font-semibold">Status</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBeneficiaries.map((beneficiary) => (
              <TableRow
                key={beneficiary.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                      <Wallet className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">
                        {formatAddress(beneficiary.accountWalletAddress)}
                      </span>
                      <span className="text-sm text-gray-500">
                        Created{" "}
                        {new Date(beneficiary.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Percent className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">
                      {beneficiary.trustPercentage}%
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{beneficiary.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{beneficiary.phoneNumber}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="capitalize">
                      {beneficiary.relationship}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      beneficiary.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : beneficiary.status === "Pending"
                        ? "bg-green-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {beneficiary.status === "Pending" ? (
                      <SetBeneficiaries />
                    ) : (
                      beneficiary.status || "Not Claimed"
                    )}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <EllipsisVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit Details</DropdownMenuItem>
                      <DropdownMenuItem>Resend Invitation</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        Remove Beneficiary
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <AddBeneficiaryModal
        isOpen={isAddBeneficiaryModalOpen}
        onClose={() => setIsAddBeneficiaryModalOpen(false)}
      />
    </div>
  );
};

export default BeneficiariesTable;
