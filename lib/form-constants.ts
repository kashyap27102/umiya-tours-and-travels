export const TRIP_TYPES = [
  "One Way",
  "Round Trip",
  "Airport Pickup",
  "Airport Drop",
  "Railway Pickup",
  "Railway Drop",
] as const;

export const CAB_VEHICLE_TYPES = [
  "Sedan",
  "SUV",
  "Innova Crysta",
  "Luxury",
] as const;

export const GROUP_VEHICLE_TYPES = [
  "Tempo Traveller 9-14",
  "Mini Bus 20-27",
  "Full Bus 35-50+",
] as const;

export const TRAVEL_PURPOSES = [
  "Tour",
  "Corporate",
  "Wedding",
  "School",
  "Pilgrimage",
  "Other",
] as const;

export const SERVICE_INTEREST_OPTIONS = [
  "Customized Travel Packages",
  "Cab Booking",
  "Vehicle Booking",
  "Pre-Designed Packages",
  "General Inquiry",
] as const;

export const FORM_LIMITS = {
  nameMin: 2,
  nameMax: 80,
  locationMin: 2,
  locationMax: 120,
  messageMin: 10,
  messageMax: 1200,
  specialRequestMax: 600,
  passengersMin: 1,
  passengersMax: 80,
} as const;
