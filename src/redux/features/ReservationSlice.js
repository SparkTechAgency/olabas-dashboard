import { createSlice } from "@reduxjs/toolkit";

// Keep initial data as fallback, but it will be replaced by API data
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

  // Step 2: Vehicle Selection - UPDATED STRUCTURE
  selectedCarSize: "Large: Premium",
  vehicle: {
    vehicleId: "683e9d30752d883af38b4c30",
    vehicleType: "LARGE PREMIUM",
    rate: 840.0,
  },
  // Keep legacy fields for backward compatibility
  vehiclePrice: 840.0,
  vehicleId: "683e9d30752d883af38b4c30",
  vehicleType: "Large: Premium",
  rate: 840.0,

  // Step 3: Add Extras
  extras: initialExtras,
  extrasInitialized: false, // Flag to track if extras have been loaded from API
  selectedExtraIds: [], // Array to track selected extra service IDs

  // Step 4: Add Protection
  protection: initialProtection,

  // Step 5: Client Details
  clientDetails: {
    isNewClient: true,
    firstName: "",
    lastName: "",
    email: "",
    phone: "", // Added
    permanentAddress: "", // Added
    presentAddress: "", // Added
    country: "", // Added
    state: "", // Added
    postCode: "", // Added
    returnLocation: "", // Keep existing
    searchQuery: "", // Keep existing
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

    // Step 2: Vehicle Selection - UPDATED ACTIONS
    setSelectedCarSize: (state, action) => {
      state.selectedCarSize = action.payload;
    },

    // NEW: Set complete vehicle object
    setVehicle: (state, action) => {
      const { vehicleId, vehicleType, rate } = action.payload;
      state.vehicle = {
        vehicleId,
        vehicleType,
        rate,
      };
      // Update legacy fields for backward compatibility
      state.vehicleId = vehicleId;
      state.vehicleType = vehicleType;
      state.vehiclePrice = rate;
      state.rate = rate;
    },

    // UPDATED: Set vehicle by ID (when selecting from dropdown)
    setSelectedVehicle: (state, action) => {
      const vehicleId = action.payload;
      state.vehicle.vehicleId = vehicleId;
      state.vehicleId = vehicleId; // Legacy field
    },

    // UPDATED: Set vehicle price and update vehicle object
    setVehiclePrice: (state, action) => {
      const price = action.payload;
      state.vehiclePrice = price;
      state.vehicle.rate = price;
      state.rate = price; // Legacy field
    },

    // NEW: Set vehicle type and update vehicle object
    setVehicleType: (state, action) => {
      const vehicleType = action.payload;
      state.vehicleType = vehicleType;
      state.vehicle.vehicleType = vehicleType;
    },

    // NEW: Update vehicle rate
    setVehicleRate: (state, action) => {
      const rate = action.payload;
      state.vehicle.rate = rate;
      state.vehiclePrice = rate; // Legacy field
      state.rate = rate; // Legacy field
    },

    // Step 3: Extras - Initialize from API
    initializeExtras: (state, action) => {
      const apiExtras = action.payload;
      state.extras = apiExtras.map((item) => ({
        _id: item._id,
        includeStatus: false, // Default to not included
        name: item.name,
        description: item.description,
        image: item.image,
        qty: 1, // Default quantity
        price: item.cost || 0, // Use cost from API, default to 0 if not present
        total: 0, // Default total
        status: item.status,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }));
      state.extrasInitialized = true;
      state.selectedExtraIds = []; // Reset selected IDs when initializing
    },

    // Step 3: Extras - Update extra
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

    // Track IDs when toggling extras
    toggleExtraInclude: (state, action) => {
      const index = action.payload;
      if (state.extras[index]) {
        const extra = state.extras[index];
        const wasIncluded = extra.includeStatus;

        extra.includeStatus = !wasIncluded;
        extra.total = extra.includeStatus ? extra.qty * extra.price : 0;

        // Update selectedExtraIds array
        const extraId = extra._id;
        if (extra.includeStatus && extraId) {
          // Add ID if not already present
          if (!state.selectedExtraIds.includes(extraId)) {
            state.selectedExtraIds.push(extraId);
          }
        } else if (!extra.includeStatus && extraId) {
          // Remove ID if present
          state.selectedExtraIds = state.selectedExtraIds.filter(
            (id) => id !== extraId
          );
        }
      }
    },

    // Set selected extra IDs directly
    setSelectedExtraIds: (state, action) => {
      state.selectedExtraIds = action.payload;
      // Update includeStatus based on selected IDs
      state.extras.forEach((extra, index) => {
        const wasSelected = extra.includeStatus;
        extra.includeStatus = state.selectedExtraIds.includes(extra._id);

        // Recalculate total if status changed
        if (wasSelected !== extra.includeStatus) {
          extra.total = extra.includeStatus ? extra.qty * extra.price : 0;
        }
      });
    },

    // Add single extra ID
    addSelectedExtraId: (state, action) => {
      const extraId = action.payload;
      if (!state.selectedExtraIds.includes(extraId)) {
        state.selectedExtraIds.push(extraId);

        // Update the corresponding extra's includeStatus
        const extraIndex = state.extras.findIndex(
          (extra) => extra._id === extraId
        );
        if (extraIndex !== -1) {
          state.extras[extraIndex].includeStatus = true;
          state.extras[extraIndex].total =
            state.extras[extraIndex].qty * state.extras[extraIndex].price;
        }
      }
    },

    // Remove single extra ID
    removeSelectedExtraId: (state, action) => {
      const extraId = action.payload;
      state.selectedExtraIds = state.selectedExtraIds.filter(
        (id) => id !== extraId
      );

      // Update the corresponding extra's includeStatus
      const extraIndex = state.extras.findIndex(
        (extra) => extra._id === extraId
      );
      if (extraIndex !== -1) {
        state.extras[extraIndex].includeStatus = false;
        state.extras[extraIndex].total = 0;
      }
    },

    // Clear all selected extras
    clearSelectedExtras: (state) => {
      state.selectedExtraIds = [];
      state.extras.forEach((extra) => {
        extra.includeStatus = false;
        extra.total = 0;
      });
    },

    // Add single extra with ID tracking
    addExtra: (state, action) => {
      const newExtra = {
        _id: action.payload._id,
        includeStatus: false,
        name: action.payload.name,
        description: action.payload.description,
        image: action.payload.image,
        qty: 1,
        price: action.payload.cost || 0,
        total: 0,
        status: action.payload.status,
        createdAt: action.payload.createdAt,
        updatedAt: action.payload.updatedAt,
      };
      state.extras.push(newExtra);
    },

    // Remove extra by ID and clean up selectedExtraIds
    removeExtra: (state, action) => {
      const extraId = action.payload;
      state.extras = state.extras.filter((extra) => extra._id !== extraId);
      // Also remove from selectedExtraIds if present
      state.selectedExtraIds = state.selectedExtraIds.filter(
        (id) => id !== extraId
      );
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
        (sum, extra) => sum + (extra.total || 0),
        0
      );
      const protectionTotal = state.protection.reduce(
        (sum, protection) => sum + (protection.total || 0),
        0
      );
      // Use vehicle.rate for calculation
      const vehicleRate = state.vehicle?.rate || state.vehiclePrice || 0;
      state.subtotal = vehicleRate + extrasTotal + protectionTotal;
      state.total = state.subtotal;
    },

    // Reset form
    resetForm: (state) => {
      return {
        ...initialState,
        extrasInitialized: false,
        selectedExtraIds: [],
      };
    },

    // Reset only extras (useful when refetching API data)
    resetExtras: (state) => {
      state.extras = [];
      state.extrasInitialized = false;
      state.selectedExtraIds = []; // Also reset selected IDs
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
  setVehicle, // NEW
  setSelectedVehicle,
  setVehiclePrice,
  setVehicleType, // NEW
  setVehicleRate, // NEW
  initializeExtras,
  updateExtra,
  toggleExtraInclude,
  setSelectedExtraIds,
  addSelectedExtraId,
  removeSelectedExtraId,
  clearSelectedExtras,
  addExtra,
  removeExtra,
  updateProtection,
  toggleProtectionInclude,
  setClientType,
  updateClientDetails,
  calculateTotals,
  resetForm,
  resetExtras,
} = carRentalSlice.actions;

export default carRentalSlice.reducer;
