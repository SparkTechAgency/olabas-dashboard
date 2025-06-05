import { createSlice } from "@reduxjs/toolkit";

const initialExtras = [
  {
    includeStatus: false,
    name: "Extra driver",
    qty: 1,
    price: 20,
    total: 0,
  },
  {
    includeStatus: false,
    name: "Child seat",
    qty: 1,
    price: 0,
    total: 0,
  },
  {
    includeStatus: true,
    name: "GPS Navigation",
    qty: 1,
    price: 50,
    total: 50,
  },
  {
    includeStatus: false,
    name: "Refuel Service",
    qty: 1,
    price: 25,
    total: 0,
  },
];

const initialProtection = [
  {
    includeStatus: false,
    name: "Default protection",
    qty: 1,
    price: 20,
    total: 0,
  },
  {
    includeStatus: true,
    name: "Collision Damage Waiver",
    qty: 1,
    price: 0,
    total: 0,
  },
  {
    includeStatus: true,
    name: "Theft Protection",
    qty: 1,
    price: 0,
    total: 0,
  },
];

const initialState = {
  currentStep: 1,

  // Step 1: Date/Time & Location
  pickupDateTime: "03/30/2025 12:00 am",
  returnDateTime: "03/30/2025 12:00 am",
  pickupLocation: "Hogarth Road, London",
  returnLocation: "Market St., Oxford",

  // Step 2: Vehicle Selection
  selectedCarSize: "Large: Premium",
  selectedVehicle: "Vehicle 2",
  vehiclePrice: 840.0,

  // Step 3: Add Extras
  extras: initialExtras,

  // Step 4: Add Protection
  protection: initialProtection,

  // Step 5: Client Details
  clientDetails: {
    isNewClient: true,
    firstName: "",
    lastName: "",
    email: "",
    returnLocation: "",
    searchQuery: "",
  },

  // Totals
  subtotal: 0,
  total: 0,
};

const carRentalSlice = createSlice({
  name: "carRental",
  initialState,
  reducers: {
    // Navigation
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },
    nextStep: (state) => {
      if (state.currentStep < 5) {
        state.currentStep += 1;
      }
    },
    previousStep: (state) => {
      if (state.currentStep > 1) {
        state.currentStep -= 1;
      }
    },

    // Step 1: Date/Time & Location
    setPickupDateTime: (state, action) => {
      state.pickupDateTime = action.payload;
    },
    setReturnDateTime: (state, action) => {
      state.returnDateTime = action.payload;
    },
    setPickupLocation: (state, action) => {
      state.pickupLocation = action.payload;
    },
    setReturnLocation: (state, action) => {
      state.returnLocation = action.payload;
    },

    // Step 2: Vehicle Selection
    setSelectedCarSize: (state, action) => {
      state.selectedCarSize = action.payload;
    },
    setSelectedVehicle: (state, action) => {
      state.selectedVehicle = action.payload;
    },
    setVehiclePrice: (state, action) => {
      state.vehiclePrice = action.payload;
    },

    // Step 3: Extras
    updateExtra: (state, action) => {
      const { index, field, value } = action.payload;
      if (state.extras[index]) {
        state.extras[index][field] = value;
        // Recalculate total for this extra
        if (field === "includeStatus" || field === "qty" || field === "price") {
          state.extras[index].total = state.extras[index].includeStatus
            ? state.extras[index].qty * state.extras[index].price
            : 0;
        }
      }
    },
    toggleExtraInclude: (state, action) => {
      const index = action.payload;
      if (state.extras[index]) {
        state.extras[index].includeStatus = !state.extras[index].includeStatus;
        state.extras[index].total = state.extras[index].includeStatus
          ? state.extras[index].qty * state.extras[index].price
          : 0;
      }
    },

    // Step 4: Protection
    updateProtection: (state, action) => {
      const { index, field, value } = action.payload;
      if (state.protection[index]) {
        state.protection[index][field] = value;
        // Recalculate total for this protection
        if (field === "includeStatus" || field === "qty" || field === "price") {
          state.protection[index].total = state.protection[index].includeStatus
            ? state.protection[index].qty * state.protection[index].price
            : 0;
        }
      }
    },
    toggleProtectionInclude: (state, action) => {
      const index = action.payload;
      if (state.protection[index]) {
        state.protection[index].includeStatus =
          !state.protection[index].includeStatus;
        state.protection[index].total = state.protection[index].includeStatus
          ? state.protection[index].qty * state.protection[index].price
          : 0;
      }
    },

    // Step 5: Client Details
    setClientType: (state, action) => {
      state.clientDetails.isNewClient = action.payload;
    },
    updateClientDetails: (state, action) => {
      state.clientDetails = { ...state.clientDetails, ...action.payload };
    },

    // Calculate totals
    calculateTotals: (state) => {
      const extrasTotal = state.extras.reduce(
        (sum, extra) => sum + extra.total,
        0
      );
      const protectionTotal = state.protection.reduce(
        (sum, protection) => sum + protection.total,
        0
      );
      state.subtotal = state.vehiclePrice + extrasTotal + protectionTotal;
      state.total = state.subtotal;
    },

    // Reset form
    resetForm: (state) => {
      return initialState;
    },
  },
});

export const {
  setCurrentStep,
  nextStep,
  previousStep,
  setPickupDateTime,
  setReturnDateTime,
  setPickupLocation,
  setReturnLocation,
  setSelectedCarSize,
  setSelectedVehicle,
  setVehiclePrice,
  updateExtra,
  toggleExtraInclude,
  updateProtection,
  toggleProtectionInclude,
  setClientType,
  updateClientDetails,
  calculateTotals,
  resetForm,
} = carRentalSlice.actions;

export default carRentalSlice.reducer;
