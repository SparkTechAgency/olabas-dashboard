import { Button, Form, Modal } from "antd";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import StepFour from "./StepFour";
import StepFive from "./StepFive";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

function ReservationAddModal({ isModalOpen, handleCancel, handleOk }) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward

  const handleNextStep = () => {
    setDirection(1);
    setStep((prevStep) => prevStep + 1);
  };

  const handlePrevStep = () => {
    setDirection(-1);
    setStep((prevStep) => prevStep - 1);
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

  // Animation transition
  const transition = {
    duration: 0.3,
    ease: "easeInOut",
  };

  return (
    <Modal
      title={getModalTitle({ step })}
      width={900}
      open={isModalOpen}
      onOk={handleOk}
      footer={null}
      onCancel={handleCancel}
    >
      <div className="w-full mt-6 overflow-hidden">
        <Form layout="vertical" initialValues={{ remember: true }}>
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transition}
            >
              {getFormStep({ step })}
            </motion.div>
          </AnimatePresence>
        </Form>

        <div className="w-full flex items-center mt-4">
          {step > 1 && (
            <Button
              className="text-sm text-gray-500 h-8"
              onClick={handlePrevStep}
              icon={<FaAngleLeft size={20} />}
            >
              Back
            </Button>
          )}
          <div className="ml-auto">
            {step < 5 && (
              <Button
                className="text-sm text-gray-500 h-8"
                onClick={handleNextStep}
                icon={<FaAngleRight size={20} />}
                iconPosition="end"
              >
                Next
              </Button>
            )}
            {step === 5 && (
              <Button
                className="text-sm bg-smart text-white border-none h-8"
                // onClick={handleSave}  // you can add save handler here
              >
                Save
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
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
