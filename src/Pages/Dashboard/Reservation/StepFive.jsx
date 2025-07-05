import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form, Input, Radio, Select } from "antd";
import { IoAt } from "react-icons/io5";
import { MdLocalPhone } from "react-icons/md";
import {
  setClientType,
  updateClientDetails,
} from "../../../redux/features/ReservationSlice"; // Update the import path

const { Option } = Select;

const StepFive = () => {
  const dispatch = useDispatch();
  const { clientDetails } = useSelector((state) => state.carRental);
  const [form] = Form.useForm();

  // Update form values when Redux state changes
  useEffect(() => {
    form.setFieldsValue(clientDetails);
  }, [clientDetails, form]);

  const handleClientChange = (e) => {
    const isNewClient = e.target.value === 1;
    dispatch(setClientType(isNewClient));

    // Clear form data when switching client type
    if (isNewClient) {
      dispatch(
        updateClientDetails({
          searchQuery: "",
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          permanentAddress: "",
          presentAddress: "",
          country: "",
          state: "",
          postCode: "",
        })
      );
    } else {
      dispatch(
        updateClientDetails({
          searchQuery: "",
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          permanentAddress: "",
          presentAddress: "",
          country: "",
          state: "",
          postCode: "",
        })
      );
    }
  };

  const handleFieldChange = (field, value) => {
    dispatch(
      updateClientDetails({
        [field]: value,
      })
    );
  };

  const onFinish = (values) => {
    console.log("Form values:", values);
    // Update Redux store with all form values
    dispatch(updateClientDetails(values));
  };

  const onValuesChange = (changedValues, allValues) => {
    // Update Redux store whenever any field changes
    dispatch(updateClientDetails(changedValues));
  };

  const countries = [
    { code: "BD", name: "Bangladesh" },
    { code: "US", name: "United States" },
    { code: "UK", name: "United Kingdom" },
    { code: "CA", name: "Canada" },
  ];

  return (
    <div className="w-full rounded-lg">
      <Radio.Group
        className="w-full flex gap-40"
        name="radiogroup"
        value={clientDetails.isNewClient ? 1 : 2}
        onChange={handleClientChange}
        options={[
          { value: 1, label: "Create a new client" },
          // { value: 2, label: "Use an existing client" },
        ]}
      />
      <Form
        form={form}
        layout="vertical"
        className="w-full mt-4"
        onFinish={onFinish}
        onValuesChange={onValuesChange}
        initialValues={clientDetails}
      >
        {clientDetails.isNewClient && (
          <>
            <div className="flex items-center my-4">
              <label className="w-40 font-semibold text-left pr-4">
                First Name
              </label>
              <Form.Item
                name="firstName"
                rules={[
                  { required: true, message: "Please input First Name!" },
                ]}
                className="flex-1 mb-0"
              >
                <Input
                  placeholder="Enter first name"
                  className="h-8"
                  value={clientDetails.firstName}
                  onChange={(e) =>
                    handleFieldChange("firstName", e.target.value)
                  }
                />
              </Form.Item>
            </div>

            <div className="flex items-center mb-4">
              <label className="w-40 font-semibold text-left pr-4">
                Last Name
              </label>
              <Form.Item
                name="lastName"
                rules={[
                  { required: true, message: "Please input the Last Name!" },
                ]}
                className="flex-1 mb-0"
              >
                <Input
                  placeholder="Enter last name"
                  className="h-8"
                  value={clientDetails.lastName}
                  onChange={(e) =>
                    handleFieldChange("lastName", e.target.value)
                  }
                />
              </Form.Item>
            </div>

            <div className="flex items-center mb-4">
              <label className="w-40 font-semibold text-left pr-4">Email</label>
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Please input Email!" },
                  { type: "email", message: "Please enter a valid email!" },
                ]}
                className="flex-1 mb-0"
              >
                <Input
                  placeholder="Enter email address"
                  className="h-8"
                  value={clientDetails.email}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                  addonBefore={<IoAt size={20} className="text-smart" />}
                />
              </Form.Item>
            </div>

            <div className="flex items-center mb-4">
              <label className="w-40 font-semibold text-left pr-4">
                Phone Number
              </label>
              <Form.Item
                name="phone"
                rules={[
                  { required: true, message: "Please input the phone number!" },
                ]}
                className="flex-1 mb-0"
              >
                <Input
                  placeholder="Enter phone number"
                  className="h-8"
                  value={clientDetails.phone}
                  onChange={(e) => handleFieldChange("phone", e.target.value)}
                  addonBefore={
                    <MdLocalPhone size={20} className="text-smart" />
                  }
                />
              </Form.Item>
            </div>

            <div className="flex items-center mb-4">
              <label className="w-40 font-semibold text-left pr-4">
                Permanent Address
              </label>
              <Form.Item
                name="permanentAddress"
                rules={[
                  {
                    required: true,
                    message: "Please input permanent address!",
                  },
                ]}
                className="flex-1 mb-0"
              >
                <Input.TextArea
                  placeholder="Enter permanent address"
                  className="h-20"
                  value={clientDetails.permanentAddress}
                  onChange={(e) =>
                    handleFieldChange("permanentAddress", e.target.value)
                  }
                  rows={2}
                />
              </Form.Item>
            </div>

            <div className="flex items-center mb-4">
              <label className="w-40 font-semibold text-left pr-4">
                Present Address
              </label>
              <Form.Item
                name="presentAddress"
                rules={[
                  { required: true, message: "Please input present address!" },
                ]}
                className="flex-1 mb-0"
              >
                <Input.TextArea
                  placeholder="Enter present address"
                  className="h-20"
                  value={clientDetails.presentAddress}
                  onChange={(e) =>
                    handleFieldChange("presentAddress", e.target.value)
                  }
                  rows={2}
                />
              </Form.Item>
            </div>

            <div className="flex items-center mb-4">
              <label className="w-40 font-semibold text-left pr-4">
                Country
              </label>
              <Form.Item
                name="country"
                rules={[{ required: true, message: "Please select country!" }]}
                className="flex-1 mb-0"
              >
                <Select
                  placeholder="Select country"
                  className="h-8"
                  value={clientDetails.country}
                  onChange={(value) => handleFieldChange("country", value)}
                >
                  {countries.map((country) => (
                    <Option key={country.code} value={country.code}>
                      {country.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <div className="flex items-center mb-4">
              <label className="w-40 font-semibold text-left pr-4">
                State/Division
              </label>
              <Form.Item
                name="state"
                rules={[
                  { required: true, message: "Please input state/division!" },
                ]}
                className="flex-1 mb-0"
              >
                <Input
                  placeholder="Enter state or division"
                  className="h-8"
                  value={clientDetails.state}
                  onChange={(e) => handleFieldChange("state", e.target.value)}
                />
              </Form.Item>
            </div>

            <div className="flex items-center mb-4">
              <label className="w-40 font-semibold text-left pr-4">
                Post Code
              </label>
              <Form.Item
                name="postCode"
                rules={[{ required: true, message: "Please input post code!" }]}
                className="flex-1 mb-0"
              >
                <Input
                  placeholder="Enter post code"
                  className="h-8"
                  value={clientDetails.postCode}
                  onChange={(e) =>
                    handleFieldChange("postCode", e.target.value)
                  }
                />
              </Form.Item>
            </div>
          </>
        )}
      </Form>
    </div>
  );
};

export default StepFive;
