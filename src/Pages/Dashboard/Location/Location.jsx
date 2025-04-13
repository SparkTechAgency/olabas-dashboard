import React from "react";
import GetPageName from "../../../components/common/GetPageName";
import { Button, Select } from "antd";
import { GrFormAdd } from "react-icons/gr";
import { FaCaretDown } from "react-icons/fa";

function Location() {
  return (
    <div className="w-full flex  justify-between items-start py-5">
      <div className="w-1/2 flex flex-col justify-between items-center py-5">
        <div className="w-full flex justify-between gap-4">
          <h1 className="text-[20px] font-medium">{GetPageName()}</h1>
          <Button
            icon={<GrFormAdd size={25} />}
            // onClick={showModal}
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
            options={[
              { value: "location1", label: "Location 1" },
              { value: "location2", label: "Location 2" },
              { value: "location3", label: "Location 3" },
            ]}
          />
          <Select
            className="w-full h-8"
            placeholder="Delivery Service"
            suffixIcon={<FaCaretDown size={20} className="text-black " />}
            options={[
              { value: "deliveryService1", label: "Delivery Service 1" },
              { value: "deliveryService2", label: "Delivery Service 2" },
              { value: "deliveryService3", label: "Delivery Service 3" },
            ]}
          />
        </div>
      </div>
      <div>
        <div>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.123456789012!2d-122.4194156846814!3d37.77492927975968!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085808c8c8c8c8c%3A0x8c8c8c8c8c8c8c8c!2sSan%20Francisco%2C%20CA%2094109%2C%20USA!5e0!3m2!1sen!2sin!4v1631234567890"
            width="600"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default Location;
