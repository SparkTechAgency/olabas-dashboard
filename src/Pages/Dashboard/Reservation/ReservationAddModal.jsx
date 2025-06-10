import { Button, Form, Modal, message } from "antd";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import {
  nextStep,
  previousStep,
  resetForm,
  calculateTotals,
} from "../../../redux/features/ReservationSlice";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import StepFour from "./StepFour";
import StepFive from "./StepFive";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { useCreateReservationMutation } from "../../../redux/apiSlices/reservation";

function ReservationAddModal({ isModalOpen, handleCancel, handleOk }) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  // Get current step and form data from Redux store
  const currentStep = useSelector((state) => state.carRental.currentStep);
  const formData = useSelector((state) => state.carRental);
  const [direction, setDirection] = React.useState(1);

  const [createReservation, { isLoading }] = useCreateReservationMutation();

  const handleNextStep = () => {
    setDirection(1);
    dispatch(calculateTotals());
    dispatch(nextStep());
  };

  const handlePrevStep = () => {
    setDirection(-1);
    dispatch(previousStep());
  };

  const transformFormData = (data) => {
    // Format dates to match API requirements
    const pickupDate = new Date(data.pickupDateTime);
    const returnDate = new Date(data.returnDateTime);

    // Filter extras that are included and map to required format
    const extraServices = data.extras
      .filter((extra) => extra.includeStatus)
      .map((extra) => ({
        id: extra.name.replace(/\s+/g, "_").toLowerCase(), // Simple ID generation
        name: extra.name,
        quantity: extra.qty,
        price: extra.price,
      }));

    return {
      pickupDate: pickupDate.toISOString(),
      pickupTime: pickupDate.toISOString(),
      pickupLocation: data.pickupLocation, // Assuming this is already the correct ID format
      returnDate: returnDate.toISOString(),
      returnTime: returnDate.toISOString(),
      returnLocation: data.returnLocation, // Assuming this is already the correct ID format
      vehicle: data.selectedVehicle, // Assuming this is already the correct ID format
      extraServices,
      clientDetails: {
        firstName: data.clientDetails.firstName,
        lastName: data.clientDetails.lastName,
        email: data.clientDetails.email,
        phone: data.clientDetails.phone || "+1234567890", // Default if not provided
        parmanentAddress: data.clientDetails.address || "Not provided",
        country: data.clientDetails.country || "US",
        presentAddress: data.clientDetails.address || "Not provided",
        state: data.clientDetails.state || "N/A",
        postCode: data.clientDetails.postCode || "0000",
      },
      paymentMethod: "STRIPE", // Default payment method
    };
  };

  const handleSave = async () => {
    try {
      dispatch(calculateTotals());

      // Transform the form data to match API requirements
      const transformedData = transformFormData(formData);

      // Call the API
      const response = await createReservation(transformedData).unwrap();

      // Show success message
      messageApi.success("Reservation created successfully!");

      // Reset form and close modal
      dispatch(resetForm());
      if (handleOk) {
        handleOk(response);
      }
    } catch (error) {
      console.error("Error creating reservation:", error);
      messageApi.error("Failed to create reservation. Please try again.");
    }
  };

  const handleModalCancel = () => {
    dispatch(resetForm());
    handleCancel();
  };

  // Animation variants
  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
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
        title={getModalTitle({ step: currentStep })}
        width={900}
        open={isModalOpen}
        onOk={handleOk}
        footer={null}
        onCancel={handleModalCancel}
      >
        <div className="w-full mt-6 overflow-hidden">
          <Form
            layout="vertical"
            form={form}
            initialValues={{ remember: true }}
          >
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
                {getFormStep({ step: currentStep })}
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
                >
                  Next
                </Button>
              )}
              {currentStep === 5 && (
                <Button
                  className="text-sm bg-smart text-white border-none h-8"
                  onClick={handleSave}
                  loading={isLoading}
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

// Helpers
const getFormStep = ({ step }) => {
  switch (step) {
    case 1:
      return <StepOne />;
    case 2:
      return <StepTwo />;
    case 3:
      return <StepThree />;
    case 4:
      return <StepFour />;
    case 5:
      return <StepFive />;
    default:
      return null;
  }
};

const getModalTitle = ({ step }) => {
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
