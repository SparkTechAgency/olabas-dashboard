import { useState, useEffect } from "react";
import { Form, Input, Modal, Upload, Button, Radio, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  useCreateTeamMutation,
  useUpdateTeamMutation,
} from "../../../redux/apiSlices/team";
import { getImageUrl } from "../../../utils/baseUrl";

const { TextArea } = Input;

function AddEditTeamMember({
  isModalOpen,
  handleOk,
  handleCancel,
  editData = null, // Pass the team member data when editing
  isEdit = false, // Boolean to determine if it's edit mode
}) {
  const [form] = Form.useForm();
  const [selectedRole, setSelectedRole] = useState("authority");
  const [loading, setLoading] = useState(false);

  const [createTeam] = useCreateTeamMutation();
  const [updateTeam] = useUpdateTeamMutation();

  // Effect to populate form when editing
  useEffect(() => {
    if (isEdit && editData) {
      form.setFieldsValue({
        name: editData.name,
        designation: editData.designation,
        teamRole: editData.teamRole,
        description: editData.teamDescription || editData.description,
      });
      // Fix: Use editData.teamRole instead of undefined teamRole
      setSelectedRole(editData?.teamRole);
    } else {
      // Reset form for add mode
      form.resetFields();
      form.setFieldsValue({ teamRole: "authority" }); // Fix: Use teamRole instead of role
      setSelectedRole("authority");
    }
  }, [isEdit, editData, form]);

  const onFinish = async (values) => {
    setLoading(true);

    try {
      const formData = new FormData();

      // Prepare the data object
      const data = {
        name: values.name,
        designation: values.designation,
        teamRole: values.teamRole.toUpperCase(), // Convert to uppercase and use teamRole
        teamDescription: values.description || "",
      };

      // Append the JSON string under the 'data' key
      formData.append("data", JSON.stringify(data));

      // Handle file upload
      const fileList = values.image;
      if (fileList && fileList.length > 0) {
        // Check if it's a new file upload or existing file
        const file = fileList[0];
        if (file.originFileObj) {
          // New file upload
          formData.append("image", file.originFileObj);
        }
      }

      let res;
      if (isEdit) {
        // Update existing team member
        res = await updateTeam({ id: editData.id, data: formData }).unwrap();
      } else {
        // Create new team member
        res = await createTeam(formData).unwrap();
      }

      if (res.success) {
        message.success(
          isEdit
            ? "Team member updated successfully"
            : "Team member added successfully"
        );
        form.resetFields();
        setSelectedRole("authority");
        handleOk(); // Close modal and refresh data
      } else {
        message.error(
          isEdit ? "Failed to update team member" : "Failed to add team member"
        );
      }
    } catch (error) {
      console.error(
        isEdit
          ? "Failed to update team member:"
          : "Failed to create team member:",
        error
      );
      message.error(
        isEdit ? "Failed to update team member" : "Failed to add team member"
      );
    } finally {
      setLoading(false);
    }
  };

  const onCancel = () => {
    form.resetFields();
    setSelectedRole("authority");
    handleCancel();
  };

  // Handle role change
  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setSelectedRole(newRole);
    form.setFieldsValue({ teamRole: newRole }); // Fix: Use teamRole instead of role
  };

  // Prepare initial file list for edit mode
  const getInitialFileList = () => {
    if (isEdit && editData && editData.image) {
      return [
        {
          uid: "-1",
          name: "Current Image",
          status: "done",
          url: `${getImageUrl()}${editData.image}`, // Assuming editData.image contains the image URL
        },
      ];
    }
    return [];
  };

  return (
    <Modal
      title={
        <span className="text-lg font-semibold">
          {isEdit ? "Edit Team Member" : "Add New Team Member"}
        </span>
      }
      open={isModalOpen}
      footer={null}
      onCancel={onCancel}
      width={600}
      closeIcon={<span className="text-xl text-green-500">×</span>}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="pt-2"
        initialValues={{ teamRole: "authority" }} // Fix: Use teamRole instead of role
      >
        <Form.Item
          label="Role"
          name="teamRole"
          rules={[{ required: true, message: "Please select a role" }]}
        >
          <Radio.Group onChange={handleRoleChange} value={selectedRole}>
            <Radio value="authority">Authority</Radio>
            <Radio value="member">Member</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter name" }]}
        >
          <Input placeholder="Enter name" />
        </Form.Item>

        <Form.Item
          label="Designation"
          name="designation"
          rules={[{ required: true, message: "Please enter designation" }]}
        >
          <Input placeholder="Enter designation" />
        </Form.Item>

        <Form.Item
          label="Image"
          name="image"
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
          rules={[
            {
              required: !isEdit, // Only required for new entries
              message: "Please upload an image",
            },
          ]}
        >
          <Upload
            beforeUpload={() => false}
            accept="image/*"
            maxCount={1}
            listType="picture"
            defaultFileList={getInitialFileList()}
          >
            <Button icon={<UploadOutlined />}>
              {isEdit ? "Change Image" : "Choose File"}
            </Button>
          </Upload>
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[
            {
              required: selectedRole === "authority",
              message: "Please enter description",
            },
          ]}
        >
          <TextArea
            rows={3}
            placeholder={
              selectedRole === "authority"
                ? "Enter authority description"
                : "Enter member description (optional)"
            }
          />
        </Form.Item>

        <Form.Item>
          <Button
            htmlType="submit"
            loading={loading}
            className="w-full text-white bg-[#00C853] hover:bg-[#00b34a] border-none"
            size="large"
          >
            {loading
              ? isEdit
                ? "Updating..."
                : "Adding..."
              : isEdit
              ? "Update Team Member"
              : "Add Team Member"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddEditTeamMember;
