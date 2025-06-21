import { useState } from "react";
import { Modal, DatePicker, Button, message } from "antd";
import { LuDownload } from "react-icons/lu";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const ExportModal = ({
  isModalOpen,
  setIsModalOpen,
  onExport,
  exportLoading,
  selectedCount = 0,
}) => {
  const [dateRange, setDateRange] = useState([]);

  const handleOk = () => {
    if (!dateRange || dateRange.length !== 2) {
      message.error("Please select both start and end dates");
      return;
    }

    const [startDate, endDate] = dateRange;

    // Call the export function with date range
    onExport({
      startDate: startDate.startOf("day"),
      endDate: endDate.endOf("day"),
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setDateRange([]);
  };

  const disabledDate = (current) => {
    // Disable future dates
    return current && current > dayjs().endOf("day");
  };

  return (
    <Modal
      title="Export Reservations"
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      width={400}
      centered
    >
      <div className="py-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Date Range
          </label>
          <RangePicker
            value={dateRange}
            onChange={setDateRange}
            format="DD/MM/YYYY"
            disabledDate={disabledDate}
            placeholder={["Start Date", "End Date"]}
            className="w-full"
            size="large"
          />
        </div>

        {selectedCount > 0 && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
            <span className="font-medium">Note:</span> {selectedCount} selected
            reservation(s) will be exported within the specified date range.
          </div>
        )}

        <div className="flex gap-2 justify-end">
          <Button onClick={handleCancel}>Cancel</Button>
          <Button
            type="primary"
            icon={<LuDownload size={16} />}
            onClick={handleOk}
            loading={exportLoading}
            className="bg-smart hover:bg-smart border-none"
          >
            Export CSV
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ExportModal;
