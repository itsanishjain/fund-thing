"use client";

import AddBeneficiaryForm from "@/components/app/AddBeneficiaryForm";
import AuthWrapper from "@/components/app/AuthWrapper";

export default function AddBeneficiaryPage() {
  return (
    <AuthWrapper>
      <AddBeneficiaryForm />
    </AuthWrapper>
  );
}
