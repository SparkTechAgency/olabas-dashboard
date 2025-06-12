// Add these selectors to your Redux slice or create a separate selectors file

import dayjs from "dayjs";
import { useDispatch } from "react-redux";

// Selector to format data for API submission
export const selectApiFormattedData = (store) => {
  const state = store.carRental;

  // Helper function to convert datetime string to separate date and time ISO strings
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return { date: null, time: null };

    const dateTime = dayjs(dateTimeString);
    return {
      date: dateTime.toISOString(), // Full ISO string for date
      time: dateTime.toISOString(), // Full ISO string for time (API seems to want same format)
    };
  };

  const pickup = formatDateTime(state.pickupDateTime);
  const returnDT = formatDateTime(state.returnDateTime);

  return {
    pickupDate: pickup.date,
    pickupTime: pickup.time,
    pickupLocation: state.pickupLocation,
    returnDate: returnDT.date,
    returnTime: returnDT.time,
    returnLocation: state.returnLocation,
    vehicle: {
      vehicleId: state.vehicle.vehicleId,
      vehicleType: state.vehicle.vehicleType,
      rate: state.vehicle.rate,
    },
    extraServices: state.selectedExtraIds, // Array of selected extra service IDs
    clientDetails: {
      firstName: state.clientDetails.firstName,
      lastName: state.clientDetails.lastName,
      email: state.clientDetails.email,
      phone: state.clientDetails.phone,
      parmanentAddress: state.clientDetails.permanentAddress, // Note: API uses "parmanentAddress"
      country: state.clientDetails.country,
      presentAddress: state.clientDetails.presentAddress,
      state: state.clientDetails.state,
      postCode: state.clientDetails.postCode,
    },
    paymentMethod: "BANK", // You might want to add this to your Redux state
  };
};

// Selector to get just Step 1 data for API
export const selectStep1ApiData = (store) => {
  const state = store.carRental;

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return { date: null, time: null };

    const dateTime = dayjs(dateTimeString);
    return {
      date: dateTime.toISOString(),
      time: dateTime.toISOString(),
    };
  };

  const pickup = formatDateTime(state.pickupDateTime);
  const returnDT = formatDateTime(state.returnDateTime);

  return {
    pickupDate: pickup.date,
    pickupTime: pickup.time,
    pickupLocation: state.pickupLocation,
    returnDate: returnDT.date,
    returnTime: returnDT.time,
    returnLocation: state.returnLocation,
  };
};

// Action creator to validate and format Step 1 data
export const validateStep1Data = () => (dispatch, getState) => {
  const step1Data = selectStep1ApiData({ carRental: getState().carRental });

  // Validation
  const errors = [];
  if (!step1Data.pickupDate) errors.push("Pickup date is required");
  if (!step1Data.pickupTime) errors.push("Pickup time is required");
  if (!step1Data.pickupLocation) errors.push("Pickup location is required");
  if (!step1Data.returnDate) errors.push("Return date is required");
  if (!step1Data.returnTime) errors.push("Return time is required");
  if (!step1Data.returnLocation) errors.push("Return location is required");

  // Check if return time is at least 3 hours after pickup
  if (step1Data.pickupTime && step1Data.returnTime) {
    const pickupTime = dayjs(step1Data.pickupTime);
    const returnTime = dayjs(step1Data.returnTime);
    const hoursDiff = returnTime.diff(pickupTime, "hours");

    if (hoursDiff < 3) {
      errors.push("Return time must be at least 3 hours after pickup time");
    }
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return { success: true, data: step1Data };
};

// Helper hook to use in your components
export const useStep1Validation = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.carRental);

  return React.useCallback(() => {
    return dispatch(validateStep1Data());
  }, [dispatch]);
};
