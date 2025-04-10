import { Form, Modal } from "antd";
import React, { useState } from "react";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import StepFour from "./StepFour";

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
      <div>
        <Form layout="vertical" initialValues={{ remember: true }}>
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-semibold">Reservation</h2>
          </div>
          {getFormStep({ step })}
        </Form>
        <div>
          {step > 1 && (
            <button
              className="mr-4 text-sm text-gray-500"
              onClick={handlePrevStep}
            >
              Previous
            </button>
          )}
          {step < 4 && (
            <button className="text-sm text-blue-500" onClick={handleNextStep}>
              Next
            </button>
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
  }
};
