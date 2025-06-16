import React, { useState, useEffect } from "react";
import GetPageName from "../../../components/common/GetPageName";
import { Button, Select, Modal, Form, Input, message } from "antd";
import { GrFormAdd } from "react-icons/gr";
import { FaCaretDown } from "react-icons/fa";
import {
  useCreateLocationMutation,
  useGetSearchLocationQuery,
} from "../../../redux/apiSlices/LocationApi";

function Location() {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapUrl, setMapUrl] = useState(
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.123456789012!2d-122.4194156846814!3d37.77492927975968!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085808c8c8c8c8c%3A0x8c8c8c8c8c8c8c8c!2sSan%20Francisco%2C%20CA%2094109%2C%20USA!5e0!3m2!1sen!2sin!4v1631234567890"
  );

  const [createLocation, { isLoading: creatingLoading }] =
    useCreateLocationMutation();
  const {
    data: locationData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetSearchLocationQuery(searchTerm);

  useEffect(() => {
    // Update map URL when location changes
    if (selectedLocation) {
      const baseUrl = "https://www.google.com/maps/embed/v1/place";
      const apiKey = "YOUR_GOOGLE_MAPS_API_KEY"; // Replace with your actual API key
      const location = encodeURIComponent(selectedLocation.label);
      const newMapUrl = `${baseUrl}?key=${apiKey}&q=${location}`;
      setMapUrl(newMapUrl);
    }
  }, [selectedLocation]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    try {
      await createLocation(values).unwrap();
      message.success("Location created successfully");
      form.resetFields();
      refetch(); // Refetch locations to update the list
      setIsModalOpen(false);
    } catch (err) {
      message.error(err?.data?.message || "Failed to create location");
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  // Transform API data to options format for Select component
  const locationOptions =
    locationData?.data?.result?.map((location) => ({
      value: location._id,
      label: location.location,
    })) || [];

  return (
    <div className="w-full flex items-start gap-14 py-5">
      <div className="w-1/2 flex flex-col justify-between items-center py-5">
        <div className="w-full flex justify-between gap-4">
          <h1 className="text-[20px] font-medium">{GetPageName()}</h1>
          <Button
            icon={<GrFormAdd size={25} />}
            onClick={showModal}
            className="bg-smart hover:bg-smart text-white border-none h-8"
          >
            Add Location
          </Button>
        </div>
        <div className="w-full flex flex-col gap-4 justify-between items-start py-5">
          <Select
            className="w-full h-8"
            placeholder="Select Location"
            suffixIcon={<FaCaretDown size={20} className="text-black" />}
            options={locationOptions}
            loading={isLoading}
            showSearch
            onSearch={handleSearch}
            filterOption={false}
            onChange={(value, option) => setSelectedLocation(option)}
            notFoundContent={isLoading ? "Searching..." : "No locations found"}
          />
        </div>
      </div>
      <div>
        <div className="border-2 rounded-lg mt-4">
          <iframe
            src={mapUrl}
            width="600"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>

      {/* Add Location Modal */}
      <Modal
        title="Add New Location"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          name="addLocation"
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true, message: "Please input the location!" }]}
          >
            <Input placeholder="Enter location (e.g., Bangladesh, China)" />
          </Form.Item>

          <Form.Item>
            <div className="flex justify-end gap-4">
              <Button onClick={handleCancel}>Cancel</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={creatingLoading}
                className="bg-smart hover:bg-smart text-white"
              >
                Submit
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Location;
