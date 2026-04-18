"use client";

import CreatedPackagesList from "@/components/admin/CreatedPackagesList";
import CustomPackageForm from "@/components/admin/CustomPackageForm";
import { useCustomPackageForm } from "@/hooks/useCustomPackageForm";

export default function CreateClientPackagePage() {
  const {
    values,
    createdPackages,
    formError,
    successMessage,
    setField,
    updateItineraryDay,
    addDay,
    removeDay,
    resetFormState,
    handleSubmit,
  } = useCustomPackageForm();

  return (
    <div className="space-y-6">
      <CustomPackageForm
        values={values}
        formError={formError}
        successMessage={successMessage}
        setField={setField}
        updateItineraryDay={updateItineraryDay}
        addDay={addDay}
        removeDay={removeDay}
        resetFormState={resetFormState}
        handleSubmit={handleSubmit}
      />

      <CreatedPackagesList createdPackages={createdPackages} />
    </div>
  );
}
