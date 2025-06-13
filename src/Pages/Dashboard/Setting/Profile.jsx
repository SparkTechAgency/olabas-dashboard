import React, { useState } from "react";
import man from "../../../assets/man.png";
import { Button, ConfigProvider, Form, Input, Upload, message } from "antd";
import { HiMiniPencil } from "react-icons/hi2";
import { useUser } from "../../../provider/User";
import { MdCameraEnhance } from "react-icons/md";
import {
  useProfileQuery,
  useUpdateProfileMutation,
} from "../../../redux/apiSlices/authApi";
import { getImageUrl } from "../../../utils/baseUrl";

function Profile() {
  const [showButton, setShowButton] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const user = useUser() || {
    name: "John Doe",
    email: "johndoe@example.com",
    phoneNumber: "+1234567890",
    role: "Admin",
    image: null,
  };

  // Add refetch capability and loading/error states
  const { data: userProfile, isLoading, error, refetch } = useProfileQuery();
  console.log("Profile data:", userProfile?.data);

  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  // Handle image upload with better validation
  const handleImageUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    const isLt5M = file.size / 1024 / 1024 < 5; // Less than 5MB

    if (!isImage) {
      message.error("You can only upload image files!");
      return Upload.LIST_IGNORE;
    }

    if (!isLt5M) {
      message.error("Image must be smaller than 5MB!");
      return Upload.LIST_IGNORE;
    }

    setUploadedImage(file);
    return false; // Prevent auto upload
  };

  // Reset states when canceling edit
  const handleCancelEdit = () => {
    setShowButton(false);
    setUploadedImage(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-72">
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-72">
        <p>Error loading profile</p>
        <Button onClick={() => refetch()} className="mt-2">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-quilocoP w-full min-h-72 flex flex-col justify-start items-center px-4 border bg-white rounded-lg">
      <div className="relative mt-6 flex flex-col items-center justify-center">
        <img
          src={
            uploadedImage
              ? URL.createObjectURL(uploadedImage)
              : userProfile?.data?.image
              ? `${getImageUrl}${userProfile?.data?.image}`
              : man
          }
          width={120}
          height={120}
          className="border border-slate-500 rounded-full object-cover"
          alt="Profile"
        />
        {showButton && (
          <Upload
            showUploadList={false}
            beforeUpload={handleImageUpload}
            accept="image/*"
          >
            <button
              type="button"
              className="absolute top-[4.5rem] left-[4.5rem]"
            >
              <MdCameraEnhance
                size={30}
                className="text-white border rounded-full bg-smart p-1 hover:bg-smart/80 transition-colors"
              />
            </button>
          </Upload>
        )}
        <h3 className="text-black text-xl mt-3">
          {userProfile?.data?.name || "User Name"}
        </h3>
      </div>

      <div className="w-full flex justify-end">
        <Button
          onClick={() => {
            if (showButton) {
              handleCancelEdit();
            } else {
              setShowButton(true);
            }
          }}
          icon={
            showButton ? null : (
              <HiMiniPencil size={20} className="text-white" />
            )
          }
          className="bg-smart/80 border-none text-white min-w-20 min-h-8 text-xs rounded-lg hover:bg-smart transition-colors"
        >
          {showButton ? "Cancel" : "Edit Profile"}
        </Button>
      </div>

      <ProfileDetails
        showButton={showButton}
        setShowButton={setShowButton}
        user={userProfile?.data}
        uploadedImage={uploadedImage}
        setUploadedImage={setUploadedImage}
        isUpdating={isUpdating}
        refetchProfile={refetch}
      />
    </div>
  );
}

export default Profile;

const ProfileDetails = ({
  showButton,
  setShowButton,
  user,
  uploadedImage,
  setUploadedImage,
  isUpdating,
  refetchProfile,
}) => {
  const [form] = Form.useForm();
  const { updateUser } = useUser();
  const [updateProfile] = useUpdateProfileMutation();

  // Set form values whenever user data changes
  React.useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role || "",
      });
    }
  }, [user, form]);

  const handleFinish = async (values) => {
    try {
      const formData = new FormData();

      // Always include the data object
      const data = {
        name: values.name?.trim(),
        phone: values.phone?.trim(),
      };

      formData.append("data", JSON.stringify(data));

      // Only append image if there's a new one uploaded
      if (uploadedImage) {
        formData.append("image", uploadedImage);
      }

      console.log("Updating profile with data:", data);
      console.log("Has new image:", !!uploadedImage);

      const response = await updateProfile(formData).unwrap();

      if (response.success) {
        message.success("Profile updated successfully!");
        setShowButton(false);
        setUploadedImage(null);

        // Update user context if available
        if (updateUser && response.data) {
          updateUser(response.data);
        }

        // Refetch profile data to ensure UI is updated
        if (refetchProfile) {
          refetchProfile();
        }
      } else {
        message.error(response.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      message.error(
        error?.data?.message ||
          error?.message ||
          "Failed to update profile. Please try again."
      );
    }
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Form: {
            labelColor: "#000000",
          },
          Input: {
            colorText: "#000000",
            colorBgBase: "#ffffff",
            colorBorder: "#000000",
            boxShadow: "none",
          },
        },
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="w-full"
        preserve={false} // Don't preserve form values when component unmounts
      >
        <div className="flex justify-between gap-2 w-full">
          <Form.Item
            name="name"
            label={<p className="text-black font-medium">Name</p>}
            className="w-full"
            rules={[
              { required: false, message: "Name is required" },
              { min: 2, message: "Name must be at least 2 characters" },
              { max: 50, message: "Name must be less than 50 characters" },
            ]}
          >
            <Input
              className="bg-white border border-black h-8 rounded-lg focus:border-smart"
              readOnly={!showButton}
              style={{ color: "black" }}
              placeholder="Enter your name"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label={<p className="text-black font-medium">Email</p>}
            className="w-full"
          >
            <Input
              className="bg-gray-100 border border-gray-400 h-8 rounded-lg"
              readOnly
              style={{ color: "gray" }}
              placeholder="Email address"
            />
          </Form.Item>
        </div>

        <div className="flex justify-between gap-2 w-full">
          <Form.Item
            name="phone"
            label={<p className="text-black font-medium">Phone</p>}
            className="w-full"
            rules={[
              { required: false, message: "Phone number is required" },
              {
                pattern: /^[+]?[\d\s\-()]+$/,
                message: "Please enter a valid phone number",
              },
            ]}
          >
            <Input
              className="bg-white border border-black h-8 rounded-lg focus:border-smart"
              readOnly={!showButton}
              style={{ color: "black" }}
              placeholder="Enter phone number"
            />
          </Form.Item>

          <Form.Item
            name="role"
            label={<p className="text-black font-medium">Role</p>}
            className="w-full"
          >
            <Input
              className="bg-gray-100 border border-gray-400 h-8 rounded-lg"
              readOnly
              style={{ color: "gray" }}
              placeholder="User role"
            />
          </Form.Item>
        </div>

        {showButton && (
          <Form.Item className="mb-0">
            <Button
              block
              htmlType="submit"
              loading={isUpdating}
              className="bg-smart hover:bg-smart/80 border-none text-white min-w-20 min-h-10 text-sm rounded-lg font-medium transition-colors"
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </Form.Item>
        )}
      </Form>
    </ConfigProvider>
  );
};
