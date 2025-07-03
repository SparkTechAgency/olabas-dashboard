import React, { useState } from "react";
import {
  Form,
  Input,
  Rate,
  Button,
  Card,
  Avatar,
  Modal,
  Row,
  Col,
  Upload,
  message,
  Popconfirm,
  Empty,
} from "antd";
import {
  PlusOutlined,
  UserOutlined,
  StarFilled,
  UploadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  useGetRatingQuery,
  useCreateRatingMutation,
  useDeleteRatingMutation,
} from "../../../redux/apiSlices/ratingApi";

const { TextArea } = Input;
import ratings from "../../../assets/ratings.png";
const Ratings = () => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  // API hooks
  const { data: ratingData, isLoading: isLoadingRatings } = useGetRatingQuery({
    page: 1,
    limit: 50,
  });
  const [createRating, { isLoading: isCreating }] = useCreateRatingMutation();
  const [deleteRating, { isLoading: isDeleting }] = useDeleteRatingMutation();

  // Get reviews from API data
  const reviews = ratingData?.data?.reviews || [];

  console.log("ratings", reviews);

  const onFinish = async (values) => {
    try {
      const formData = {
        rating: values.rating,
        comment: values.comment,
        clientEmail: values.email, // Using name as clientEmail based on your API structure
        clientName: values.clientName,
      };

      await createRating(formData).unwrap();
      message.success("Rating added successfully!");
      form.resetFields();
      setVisible(false);
    } catch (error) {
      console.error("Error creating rating:", error);

      // Handle different types of error responses
      let errorMessage = "Failed to add rating. Please try again.";

      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (
        error?.data?.errorMessages &&
        error.data.errorMessages.length > 0
      ) {
        errorMessage = error.data.errorMessages
          .map((err) => err.message)
          .join(", ");
      } else if (error?.message) {
        errorMessage = error.message;
      }

      message.error(errorMessage);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteRating(id).unwrap();
      message.success("Rating deleted successfully!");
    } catch (error) {
      console.error("Error deleting rating:", error);

      // Handle different types of error responses
      let errorMessage = "Failed to delete rating. Please try again.";

      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (
        error?.data?.errorMessages &&
        error.data.errorMessages.length > 0
      ) {
        errorMessage = error.data.errorMessages
          .map((err) => err.message)
          .join(", ");
      } else if (error?.message) {
        errorMessage = error.message;
      }

      message.error(errorMessage);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setVisible(true)}
          style={{
            background: "linear-gradient(135deg, #52c41a, #73d13d)",
            border: "none",
            height: 40,
            padding: "0 24px",
            borderRadius: 8,
            fontWeight: 500,
          }}
        >
          Add Rating
        </Button>
      </div>

      {/* Rating Cards Grid */}
      <div className="w-full p-2 border-b-2 border-[#6dd037]  rounded-md max-h-[75vh] overflow-y-scroll">
        <Row gutter={[16, 16]}>
          {reviews.map((review) => (
            <Col xs={24} sm={12} md={8} key={review._id}>
              <div
                style={{ position: "relative", height: "100%" }}
                onMouseEnter={() => setHoveredCard(review._id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <Card
                  style={{
                    borderRadius: 8,
                    transition: "all 0.3s",
                    transform:
                      hoveredCard === review._id ? "translateY(-4px)" : "none",
                    boxShadow:
                      hoveredCard === review._id
                        ? "0 4px 12px rgba(0,0,0,0.1)"
                        : "none",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                  cover={
                    <div style={{ height: 160, overflow: "hidden" }}>
                      <img
                        alt="rating"
                        src={review.image || ratings}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          backgroundColor: "#f0f0f0", // Fallback color
                        }}
                      />
                    </div>
                  }
                >
                  <div style={{ flex: 1 }}>
                    <Card.Meta
                      avatar={<Avatar icon={<UserOutlined />} />}
                      title={
                        <div>
                          <Rate
                            disabled
                            value={review.rating}
                            character={<StarFilled />}
                            style={{ fontSize: 16, color: "#52c41a" }}
                          />
                        </div>
                      }
                      description={
                        <div>
                          <div
                            className="max-h-40 overflow-auto [&::-webkit-scrollbar]:w-1
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
                          >
                            <p style={{ marginTop: 8 }}>{review.comment}</p>
                          </div>

                          <div
                            style={{ color: "rgba(0,0,0,0.45)", marginTop: 8 }}
                          >
                            <p>- {review.clientName}</p>
                            <p style={{ fontSize: "12px" }}>
                              {formatDate(review.createdAt)}
                            </p>
                          </div>
                        </div>
                      }
                    />
                  </div>
                </Card>

                {/* Delete Button (appears on hover) */}
                {hoveredCard === review._id && (
                  <Popconfirm
                    title="Delete this rating?"
                    description="Are you sure you want to delete this rating?"
                    onConfirm={() => handleDelete(review._id)}
                    okText="Yes"
                    cancelText="No"
                    placement="topRight"
                  >
                    <Button
                      danger
                      type="primary"
                      shape="circle"
                      icon={<DeleteOutlined />}
                      loading={isDeleting}
                      style={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        zIndex: 1,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      }}
                    />
                  </Popconfirm>
                )}
              </div>
            </Col>
          ))}
        </Row>
      </div>
      {reviews.length === 0 && !isLoadingRatings && (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <Empty description="No ratings yet. Be the first to add one!" />
        </div>
      )}

      {/* Add Rating Modal */}
      <Modal
        title="Add Your Rating"
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="rating"
            label="Rating"
            rules={[{ required: true, message: "Please rate!" }]}
          >
            <Rate
              character={<StarFilled />}
              style={{ color: "#52c41a", fontSize: 24 }}
            />
          </Form.Item>
          <Form.Item
            name="clientName"
            label="Your Name"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input placeholder="john" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Your Email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input placeholder="john@example.com" />
          </Form.Item>

          <Form.Item
            name="comment"
            label="Comment"
            rules={[{ required: true, message: "Please input your comment!" }]}
          >
            <TextArea rows={4} placeholder="Share your experience..." />
          </Form.Item>

          <Form.Item>
            <div
              style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}
            >
              <Button onClick={() => setVisible(false)}>Cancel</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isCreating}
                style={{
                  background: "linear-gradient(135deg, #52c41a, #73d13d)",
                  border: "none",
                }}
              >
                Submit
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Ratings;
