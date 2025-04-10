import React from "react";
import { Modal } from "antd";
import evidience from "../../../assets/evidience.jpg"; // Image path

function DetailsModal({ isModalOpen, setIsModalOpen, record }) {
  // Check if the record data is available
  if (!record) {
    return null; // Don't render anything if record is not provided
  }

  return (
    <Modal
      centered
      width={700}
      title="Report Details"
      visible={isModalOpen}
      footer={null}
      onCancel={() => setIsModalOpen(false)} // Close modal on cancel
    >
      <div>
        <p>
          <strong>Report ID:</strong> {record.reportID || "N/A"}
        </p>
        <p>
          <strong>Post ID:</strong> {record.postID || "N/A"}
        </p>
        <p>
          <strong>Post Title:</strong> {record.postTitle || "N/A"}
        </p>
        <p>
          <strong>Author:</strong> {record.author || "N/A"}
        </p>
        <p>
          <strong>Reported By:</strong> {record.reportedBy || "N/A"}
        </p>
        <p>
          <strong>Status:</strong> {record.status || "N/A"}
        </p>
      </div>

      <div className="mt-3">
        <p className="mb-2">
          <strong>Description:</strong>
        </p>
        <div className="border rounded-md p-3">
          {/* <p>{record.description || }</p> */}
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur
            impedit voluptatum mollitia provident! Illum aperiam mollitia eum a
            alias consequuntur enim voluptatibus quidem distinctio repellendus
            dicta consequatur inventore ratione neque, iusto officia quam! Harum
            molestiae sequi minus fugit, officia quo. Aperiam hic consequatur,
            distinctio dicta eos provident at, excepturi pariatur nam adipisci
            fugit voluptate perspiciatis tempora tempore debitis obcaecati?
            Deserunt sequi minima exercitationem? Tempora eos id dolores magni
            modi quaerat doloribus iure dicta, accusantium quia vitae,
            voluptatum soluta molestiae totam.
          </p>
        </div>
      </div>

      <div className="mt-3">
        <p className="mb-2">
          <strong>Evidence:</strong>
        </p>
        <div className="border rounded-md flex items-center justify-between flex-wrap">
          {[...Array(5)].map((_, index) => (
            <img
              key={index} // Ensure each item has a unique key
              className="border h-32 rounded-md"
              width={120} // Size for the image
              src={evidience} // Image path
              alt={`Image ${index + 1}`} // Alt text for accessibility
            />
          ))}
        </div>
      </div>
    </Modal>
  );
}

export default DetailsModal;
