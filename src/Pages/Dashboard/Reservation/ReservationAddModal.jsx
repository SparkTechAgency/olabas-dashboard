import { Button, Form, Modal, message } from "antd";
import { useState, useEffect } from "react";
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
} from "../../../redux/features/ReservationSlice";

function ReservationAddModal({ isModalOpen, handleCancel, handleOk }) {
  const [hasError, setHasError] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [direction, setDirection] = useState(1);
  const [stepValidationState, setStepValidationState] = useState({});

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
      setStepValidationState({});
    }
  }, [isModalOpen, dispatch, form]);

  // Clear error state when step changes
  useEffect(() => {
    setHasError(false);
    setIsClicked(false);
  }, [currentStep]);

  // Real-time validation effect - validates current step whenever relevant data changes
  useEffect(() => {
    const validateInBackground = async () => {
      try {
        const stepFields = getStepFields(currentStep);

        // Validate form fields if they exist
        if (stepFields.length > 0) {
          await form.validateFields(stepFields);
        }

        // Additional custom validation based on step using Redux state
        switch (currentStep) {
          case 1:
            if (
              !pickupDateTime ||
              !returnDateTime ||
              !pickupLocation ||
              !returnLocation
            ) {
              throw new Error("All fields are required");
            }

            const now = new Date();
            const pickup = new Date(pickupDateTime);
            const returnDate = new Date(returnDateTime);

            if (pickup <= now || returnDate <= now || returnDate <= pickup) {
              throw new Error("Invalid dates");
            }
            break;
          case 2:
            if (!vehicle?.vehicleId) {
              throw new Error("Please select a vehicle");
            }
            break;
          case 5:
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

        // Mark this step as valid
        setStepValidationState((prev) => ({
          ...prev,
          [currentStep]: true,
        }));
        setHasError(false);
      } catch (error) {
        // Mark this step as invalid
        setStepValidationState((prev) => ({
          ...prev,
          [currentStep]: false,
        }));
        setHasError(true);
      }
    };

    // Only validate if we have some data to work with
    validateInBackground();
  }, [
    currentStep,
    pickupDateTime,
    returnDateTime,
    pickupLocation,
    returnLocation,
    vehicle,
    clientDetails,
    form,
  ]);

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

  // Helper function to extract error messages from API response
  const extractErrorMessage = (error) => {
    if (error?.data) {
      if (error.data.message) {
        return error.data.message;
      }
      if (error.data.errorMessages && Array.isArray(error.data.errorMessages)) {
        return error.data.errorMessages.map((err) => err.message).join(", ");
      }
      if (error.data.errors && typeof error.data.errors === "object") {
        return Object.values(error.data.errors).join(", ");
      }
    }
    if (error?.message) {
      return error.message;
    }
    if (typeof error === "string") {
      return error;
    }
    return "An unexpected error occurred. Please try again.";
  };

  // Validate current step fields for when user clicks Next
  const validateCurrentStepForNavigation = async () => {
    try {
      const stepFields = getStepFields(currentStep);

      // First, validate form fields if they exist
      if (stepFields.length > 0) {
        await form.validateFields(stepFields);
      }

      // Additional custom validation based on step using Redux state
      switch (currentStep) {
        case 1:
          if (!pickupDateTime || !returnDateTime) {
            throw new Error("Date and time are required");
          }
          if (!pickupLocation || !returnLocation) {
            throw new Error("Pickup and return locations are required");
          }

          const now = new Date();
          const pickup = new Date(pickupDateTime);
          const returnDate = new Date(returnDateTime);

          if (pickup <= now) {
            throw new Error("Pickup date must be in the future");
          }
          if (returnDate <= now) {
            throw new Error("Return date must be in the future");
          }
          if (returnDate <= pickup) {
            throw new Error("Return date must be after pickup date");
          }
          break;
        case 2:
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
      messageApi.error(error.message || "Validation failed");
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
        return [];
      case 4:
        return [];
      case 5:
        return ["firstName", "lastName", "email"];
      default:
        return [];
    }
  };

  const handleNextStep = async () => {
    setIsClicked(true);

    console.log(
      `Attempting to go from step ${currentStep} to step ${currentStep + 1}`
    );
    console.log("Current Redux state:", {
      pickupDateTime,
      returnDateTime,
      pickupLocation,
      returnLocation,
      vehicle,
      clientDetails,
    });

    const isValid = await validateCurrentStepForNavigation();
    console.log("Validation result:", isValid);

    if (isValid) {
      setDirection(1);
      setHasError(false);
      dispatch(nextStep());
      console.log("Moving to next step");
    } else {
      setHasError(true);
      console.log("Validation failed, staying on current step");
    }
  };

  const handlePrevStep = () => {
    setDirection(-1);
    setHasError(false);
    setIsClicked(false);
    dispatch(previousStep());
  };

  const handleSave = async () => {
    try {
      await form.validateFields();
      const allStepsValid = await validateCurrentStepForNavigation();

      if (!allStepsValid) {
        return;
      }

      const transformedData = transformFormData();
      await createReservation(transformedData).unwrap();
      messageApi.success("Reservation created successfully!");

      dispatch(resetForm());
      if (handleOk) handleOk();
    } catch (error) {
      console.error("Error creating reservation:", error);
      const errorMessage = extractErrorMessage(error);
      messageApi.error(errorMessage);

      if (
        errorMessage.toLowerCase().includes("date") ||
        errorMessage.toLowerCase().includes("time")
      ) {
        dispatch(setCurrentStep(1));
      }
    }
  };

  const handleModalCancel = () => {
    dispatch(resetForm());
    form.resetFields();
    setHasError(false);
    setIsClicked(false);
    setValidationErrors({});
    setStepValidationState({});
    handleCancel();
  };

  // Transform form data for API submission
  // const transformFormData = () => {
  //   const parseDateTime = (dateTimeString) => {
  //     if (!dateTimeString) return new Date().toISOString();

  //     try {
  //       const [datePart, timePart, period] = dateTimeString.split(" ");
  //       const [month, day, year] = datePart.split("/");
  //       const [hours, minutes] = timePart.split(":");

  //       let hour24 = parseInt(hours);
  //       if (period?.toLowerCase() === "pm" && hour24 !== 12) {
  //         hour24 += 12;
  //       } else if (period?.toLowerCase() === "am" && hour24 === 12) {
  //         hour24 = 0;
  //       }

  //       const date = new Date(year, month - 1, day, hour24, parseInt(minutes));
  //       return date.toISOString();
  //     } catch (error) {
  //       console.warn("Date parsing error:", error);
  //       return new Date().toISOString();
  //     }
  //   };

  //   const formatExtraServices = () => {
  //     return extras
  //       .filter((extra) => extra.includeStatus && extra._id)
  //       .map((extra) => ({
  //         serviceId: extra._id,
  //         qty: extra.qty || 1,
  //       }));
  //   };

  //   const formattedPickupDateTime = parseDateTime(pickupDateTime);
  //   const formattedReturnDateTime = parseDateTime(returnDateTime);

  //   return {
  //     pickupDate: formattedPickupDateTime,
  //     pickupTime: formattedPickupDateTime,
  //     pickupLocation: pickupLocation,
  //     returnDate: formattedReturnDateTime,
  //     returnTime: formattedReturnDateTime,
  //     returnLocation: returnLocation,
  //     vehicle: {
  //       vehicleId: vehicle?.vehicleId || "",
  //       vehicleType: vehicle?.vehicleType || "",
  //       rate: vehicle?.rate || 0,
  //     },
  //     extraServices: formatExtraServices(),
  //     clientDetails: {
  //       firstName: clientDetails.firstName || "",
  //       lastName: clientDetails.lastName || "",
  //       email: clientDetails.email || "",
  //       phone: clientDetails.phone || "",
  //       parmanentAddress: clientDetails.permanentAddress || "",
  //       country: clientDetails.country || "",
  //       presentAddress: clientDetails.presentAddress || "",
  //       state: clientDetails.state || "",
  //       postCode: clientDetails.postCode || "",
  //     },
  //     paymentMethod: clientDetails.paymentMethod || "BANK",
  //   };
  // };

  const transformFormData = () => {
    const parseDateTime = (dateTimeString) => {
      if (!dateTimeString) return new Date().toISOString();

      try {
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

    const formatExtraServices = () => {
      const services = [];

      // Add extra services
      extras
        .filter((extra) => extra.includeStatus && extra._id)
        .forEach((extra) => {
          services.push({
            serviceId: extra._id,
            qty: extra.qty || 1,
          });
        });

      // Add protection services
      protection
        .filter((protect) => protect.includeStatus && protect._id)
        .forEach((protect) => {
          services.push({
            protectionId: protect._id,
            qty: protect.qty || 1,
          });
        });

      return services;
    };

    const formattedPickupDateTime = parseDateTime(pickupDateTime);
    const formattedReturnDateTime = parseDateTime(returnDateTime);

    return {
      pickupDate: formattedPickupDateTime,
      pickupTime: formattedPickupDateTime,
      pickupLocation: pickupLocation,
      returnDate: formattedReturnDateTime,
      returnTime: formattedReturnDateTime,
      returnLocation: returnLocation,
      vehicle: {
        vehicleId: vehicle?.vehicleId || "",
        vehicleType: vehicle?.vehicleType || "",
        rate: vehicle?.rate || 0,
      },
      extraServices: formatExtraServices(),
      clientDetails: {
        firstName: clientDetails.firstName || "",
        lastName: clientDetails.lastName || "",
        email: clientDetails.email || "",
        phone: clientDetails.phone || "",
        parmanentAddress: clientDetails.permanentAddress || "",
        country: clientDetails.country || "",
        presentAddress: clientDetails.presentAddress || "",
        state: clientDetails.state || "",
        postCode: clientDetails.postCode || "",
      },
      paymentMethod: clientDetails.paymentMethod || "BANK",
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

  // Determine if Next button should be disabled
  const isNextButtonDisabled = hasError;

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
                  disabled={isNextButtonDisabled}
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
