"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AddBeneficiaryForm from "./AddBeneficiaryForm";

interface AddBeneficiaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddBeneficiaryModal({ isOpen, onClose }: AddBeneficiaryModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Beneficiary</DialogTitle>
        </DialogHeader>
        <AddBeneficiaryForm onSuccess={onClose} />
      </DialogContent>
    </Dialog>
  );
} 