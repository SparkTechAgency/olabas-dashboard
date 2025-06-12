import { Button, Form, Modal, message } from "antd";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import StepFour from "./StepFour";
import StepFive from "./StepFive";
import { useCreateReservationMutation } from "../../../redux/apiSlices/reservation";
import {
  setCurrentStep,
  nextStep,
  previousStep,
  calculateTotals,
  resetForm,
} from "../../../redux/features/ReservationSlice"; // Adjust path as needed

function ReservationAddModal({ isModalOpen, handleCancel, handleOk }) {
  const [hasError, setHasError] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [direction, setDirection] = useState(1);

  // Redux state and dispatch
  const dispatch = useDispatch();
  const {
    currentStep,
    pickupDateTime,
    returnDateTime,
    pickupLocation,
    returnLocation,
    vehicle,
    extras,
    protection,
    clientDetails,
    total,
    subtotal,
    selectedExtraIds,
  } = useSelector((state) => state.carRental);

  const [createReservation, { isLoading }] = useCreateReservationMutation();

  // Calculate totals whenever relevant state changes
  useEffect(() => {
    dispatch(calculateTotals());
  }, [dispatch, vehicle, extras, protection]);

  // Reset form when modal opens
  useEffect(() => {
    if (isModalOpen) {
      dispatch(resetForm());
      form.resetFields();
      setHasError(false);
      setIsClicked(false);
      setValidationErrors({});
    }
  }, [isModalOpen, dispatch, form]);

  // Update form fields when Redux state changes
  useEffect(() => {
    if (isModalOpen) {
      const formValues = {
        // Step 1 fields
        pickupTime: pickupDateTime,
        returnTime: returnDateTime,
        pickupLocation,
        returnLocation,

        // Step 2 fields
        selectedVehicle: vehicle?.vehicleId,
        vehicleType: vehicle?.vehicleType,

        // Step 3 fields - extras will be handled in StepThree component

        // Step 4 fields - protection will be handled in StepFour component

        // Step 5 fields
        firstName: clientDetails.firstName,
        lastName: clientDetails.lastName,
        email: clientDetails.email,
        isNewClient: clientDetails.isNewClient,
      };

      form.setFieldsValue(formValues);
    }
  }, [
    isModalOpen,
    form,
    pickupDateTime,
    returnDateTime,
    pickupLocation,
    returnLocation,
    vehicle,
    clientDetails,
  ]);

  // Validate current step fields
  const validateCurrentStep = async () => {
    try {
      const stepFields = getStepFields(currentStep);

      if (stepFields.length > 0) {
        await form.validateFields(stepFields);
      }

      // Additional custom validation based on step
      switch (currentStep) {
        case 1:
          // Validate pickup and return times
          if (!pickupDateTime || !returnDateTime) {
            throw new Error("Date and time are required");
          }
          if (!pickupLocation || !returnLocation) {
            throw new Error("Pickup and return locations are required");
          }
          break;
        case 2:
          // Validate vehicle selection
          if (!vehicle?.vehicleId) {
            throw new Error("Please select a vehicle");
          }
          break;
        case 3:
          // Extras are optional, no validation needed
          break;
        case 4:
          // Protection options validation if needed
          break;
        case 5:
          // Validate client details
          if (
            !clientDetails.firstName ||
            !clientDetails.lastName ||
            !clientDetails.email
          ) {
            throw new Error("Client details are required");
          }
          break;
        default:
          break;
      }

      return true;
    } catch (error) {
      console.warn("Validation failed:", error);
      return false;
    }
  };

  // Get fields that need validation for each step
  const getStepFields = (step) => {
    switch (step) {
      case 1:
        return ["pickupTime", "returnTime", "pickupLocation", "returnLocation"];
      case 2:
        return ["selectedVehicle"];
      case 3:
        return []; // Extras are optional
      case 4:
        return []; // Protection might have its own validation
      case 5:
        return ["firstName", "lastName", "email"];
      default:
        return [];
    }
  };

  const handleNextStep = async () => {
    setIsClicked(true);

    const isValid = await validateCurrentStep();

    if (isValid) {
      setDirection(1);
      setHasError(false);
      dispatch(nextStep());
    } else {
      setHasError(true);
      messageApi.error("Please fill in all required fields before proceeding.");
    }
  };

  const handlePrevStep = () => {
    setDirection(-1);
    setHasError(false); // Reset error state when going back
    dispatch(previousStep());
  };

  const handleSave = async () => {
    try {
      // Validate all form fields for final submission
      await form.validateFields();

      // Additional validation for all steps
      const allStepsValid = await Promise.all([
        validateCurrentStep(),
        // Add any other validation needed
      ]);

      if (!allStepsValid.every(Boolean)) {
        messageApi.error("Please ensure all steps are completed correctly.");
        return;
      }

      const transformedData = transformFormData();

      await createReservation(transformedData).unwrap();
      messageApi.success("Reservation created successfully!");

      // Reset Redux state
      dispatch(resetForm());
      if (handleOk) handleOk();
    } catch (error) {
      console.error("Error creating reservation:", error);
      messageApi.error("Failed to create reservation. Please try again.");
    }
  };

  const handleModalCancel = () => {
    dispatch(resetForm());
    form.resetFields();
    setHasError(false);
    setIsClicked(false);
    setValidationErrors({});
    handleCancel();
  };

  // Transform form data for API submission
  const transformFormData = () => {
    // Helper function to parse date/time string and create ISO format
    const parseDateTime = (dateTimeString) => {
      if (!dateTimeString) return new Date().toISOString();

      try {
        // If the format is "03/30/2025 12:00 am", parse it
        const [datePart, timePart, period] = dateTimeString.split(" ");
        const [month, day, year] = datePart.split("/");
        const [hours, minutes] = timePart.split(":");

        let hour24 = parseInt(hours);
        if (period?.toLowerCase() === "pm" && hour24 !== 12) {
          hour24 += 12;
        } else if (period?.toLowerCase() === "am" && hour24 === 12) {
          hour24 = 0;
        }

        const date = new Date(year, month - 1, day, hour24, parseInt(minutes));
        return date.toISOString();
      } catch (error) {
        console.warn("Date parsing error:", error);
        return new Date().toISOString();
      }
    };

    // Format extra services - only include selected extras with quantities
    const formatExtraServices = () => {
      return extras
        .filter((extra) => extra.includeStatus && extra._id) // Only selected extras with IDs
        .map((extra) => ({
          serviceId: extra._id,
          qty: extra.qty || 1,
        }));
    };

    // Parse the date/time strings from Redux state
    const formattedPickupDateTime = parseDateTime(pickupDateTime);
    const formattedReturnDateTime = parseDateTime(returnDateTime);

    return {
      // Split pickup date/time - using same value for both date and time as per your example
      pickupDate: formattedPickupDateTime,
      pickupTime: formattedPickupDateTime,
      pickupLocation: pickupLocation, // Assuming this is already an ID, if not you'll need to map it

      // Split return date/time - using same value for both date and time as per your example
      returnDate: formattedReturnDateTime,
      returnTime: formattedReturnDateTime,
      returnLocation: returnLocation, // Assuming this is already an ID, if not you'll need to map it

      // Vehicle information
      vehicle: {
        vehicleId: vehicle?.vehicleId || "",
        vehicleType: vehicle?.vehicleType || "",
        rate: vehicle?.rate || 0,
      },

      // Extra services - only selected ones with quantities
      extraServices: formatExtraServices(),

      // Client details with proper field mapping
      clientDetails: {
        firstName: clientDetails.firstName || "",
        lastName: clientDetails.lastName || "",
        email: clientDetails.email || "",
        phone: clientDetails.phone || "",
        parmanentAddress: clientDetails.permanentAddress || "", // Note: API uses "parmanentAddress" (typo?)
        country: clientDetails.country || "",
        presentAddress: clientDetails.presentAddress || "",
        state: clientDetails.state || "",
        postCode: clientDetails.postCode || "",
      },

      // Add payment method if it exists in your state, otherwise default
      paymentMethod: clientDetails.paymentMethod || "BANK", // You may need to add this field to your Redux state
    };
  };

  const getFormStep = (step) => {
    const commonProps = {
      setHasError,
      isClicked,
      setIsClicked,
      form,
      validationErrors,
      setValidationErrors,
    };

    switch (step) {
      case 1:
        return <StepOne {...commonProps} />;
      case 2:
        return <StepTwo {...commonProps} />;
      case 3:
        return <StepThree {...commonProps} />;
      case 4:
        return <StepFour {...commonProps} />;
      case 5:
        return <StepFive {...commonProps} />;
      default:
        return null;
    }
  };

  const getModalTitle = (step) => {
    switch (step) {
      case 1:
        return "Step 1 - Set Date/Time & Location";
      case 2:
        return "Step 2 - Choose Vehicle";
      case 3:
        return "Step 3 - Add Extras";
      case 4:
        return "Step 4 - Add Protection";
      case 5:
        return "Step 5 - Client details";
      default:
        return "Reservation";
    }
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({
      x: direction > 0 ? -500 : 500,
      opacity: 0,
    }),
  };

  const transition = {
    duration: 0.3,
    ease: "easeInOut",
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={getModalTitle(currentStep)}
        width={900}
        open={isModalOpen}
        onOK={handleOk}
        footer={null}
        onCancel={handleModalCancel}
      >
        <div className="w-full mt-6 overflow-hidden">
          {/* Display current totals */}
          {currentStep > 2 && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          )}

          <Form layout="vertical" form={form}>
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={currentStep}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transition}
              >
                {getFormStep(currentStep)}
              </motion.div>
            </AnimatePresence>
          </Form>

          <div className="w-full flex items-center mt-4">
            {currentStep > 1 && (
              <Button
                className="text-sm text-gray-500 h-8"
                onClick={handlePrevStep}
                icon={<FaAngleLeft size={20} />}
              >
                Back
              </Button>
            )}
            <div className="ml-auto">
              {currentStep < 5 && (
                <Button
                  className="text-sm text-gray-500 h-8"
                  onClick={handleNextStep}
                  icon={<FaAngleRight size={20} />}
                  iconPosition="end"
                  disabled={hasError && isClicked}
                >
                  Next
                </Button>
              )}
              {currentStep === 5 && (
                <Button
                  className="text-sm bg-smart text-white border-none h-8"
                  onClick={handleSave}
                  loading={isLoading}
                  disabled={hasError}
                >
                  Save
                </Button>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default ReservationAddModal;
