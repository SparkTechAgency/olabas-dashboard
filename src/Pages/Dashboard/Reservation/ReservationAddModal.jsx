import { Button, Form, Modal } from "antd";
import React, { useState } from "react";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import StepFour from "./StepFour";
import StepFive from "./StepFive";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
function ReservationAddModal({ isModalOpen, handleCancel, handleOk }) {
  const [step, setStep] = useState(1);

  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handlePrevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  return (
    <Modal
      title="Basic Modal"
      width={900}
      height={800}
      open={isModalOpen}
      onOk={handleOk}
      footer={null}
      onCancel={handleCancel}
    >
      <div className="w-full">
        <Form layout="vertical" initialValues={{ remember: true }}>
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-semibold">Reservation</h2>
          </div>
          {getFormStep({ step })}
        </Form>
        <div className="w-full flex justify-between mt-4">
          {step > 1 && (
            <Button
              className=" text-sm text-gray-500 h-8"
              onClick={handlePrevStep}
              icon={<FaAngleLeft size={20} />}
            >
              Back
            </Button>
          )}
          {step < 5 && (
            <Button
              className=" flex justify-end text-sm text-gray-500 h-8"
              onClick={handleNextStep}
              icon={<FaAngleRight size={20} />}
              iconPosition="end"
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default ReservationAddModal;
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
  }
};
