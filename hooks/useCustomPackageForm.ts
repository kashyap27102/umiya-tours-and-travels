"use client";

import { useState } from "react";

export type ItineraryDay = {
  dayLabel: string;
  details: string;
};

export type CustomPackageValues = {
  packageName: string;
  travelerCount: string;
  departureDate: string;
  arrivalDate: string;
  departurePlace: string;
  arrivalPlace: string;
  amountPerPerson: string;
  vehicle: string;
  itinerary: ItineraryDay[];
};

export type CreatedPackage = CustomPackageValues & {
  id: string;
  createdAt: string;
};

export const getInitialCustomPackageValues = (): CustomPackageValues => ({
  packageName: "",
  travelerCount: "",
  departureDate: "",
  arrivalDate: "",
  departurePlace: "",
  arrivalPlace: "",
  amountPerPerson: "",
  vehicle: "",
  itinerary: [{ dayLabel: "Day 1", details: "" }],
});

export function useCustomPackageForm() {
  const [values, setValues] = useState<CustomPackageValues>(
    getInitialCustomPackageValues,
  );
  const [createdPackages, setCreatedPackages] = useState<CreatedPackage[]>([]);
  const [formError, setFormError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const setField = <K extends keyof CustomPackageValues>(
    key: K,
    value: CustomPackageValues[K],
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const updateItineraryDay = (
    index: number,
    key: keyof ItineraryDay,
    nextValue: string,
  ) => {
    setValues((prev) => ({
      ...prev,
      itinerary: prev.itinerary.map((item, currentIndex) =>
        currentIndex === index ? { ...item, [key]: nextValue } : item,
      ),
    }));
  };

  const addDay = () => {
    setValues((prev) => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        {
          dayLabel: `Day ${prev.itinerary.length + 1}`,
          details: "",
        },
      ],
    }));
  };

  const removeDay = (index: number) => {
    setValues((prev) => {
      if (prev.itinerary.length === 1) {
        return prev;
      }

      const updated = prev.itinerary
        .filter((_, currentIndex) => currentIndex !== index)
        .map((item, currentIndex) => ({
          ...item,
          dayLabel: item.dayLabel.trim()
            ? item.dayLabel
            : `Day ${currentIndex + 1}`,
        }));

      return {
        ...prev,
        itinerary: updated,
      };
    });
  };

  const resetFormState = () => {
    setValues(getInitialCustomPackageValues());
    setFormError("");
    setSuccessMessage("");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");
    setSuccessMessage("");

    const hasEmptyItinerary = values.itinerary.some(
      (item) => !item.details.trim(),
    );

    if (
      !values.packageName.trim() ||
      !values.travelerCount.trim() ||
      !values.departureDate ||
      !values.arrivalDate ||
      !values.departurePlace.trim() ||
      !values.arrivalPlace.trim() ||
      !values.amountPerPerson.trim() ||
      !values.vehicle.trim() ||
      hasEmptyItinerary
    ) {
      setFormError(
        "Please fill all required fields before creating the package.",
      );
      return;
    }

    if (new Date(values.arrivalDate) < new Date(values.departureDate)) {
      setFormError("Arrival date cannot be earlier than departure date.");
      return;
    }

    const newPackage: CreatedPackage = {
      ...values,
      id: `${Date.now()}`,
      createdAt: new Date().toLocaleString(),
    };

    setCreatedPackages((prev) => [newPackage, ...prev]);
    setValues(getInitialCustomPackageValues());
    setSuccessMessage("Custom package created successfully.");
  };

  return {
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
  };
}
