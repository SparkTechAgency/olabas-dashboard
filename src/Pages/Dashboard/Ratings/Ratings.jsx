import React, { useState } from "react";
import {
  Form,
  Input,
  Rate,
  Button,
  Card,
  Avatar,
  Statistic,
  Row,
  Col,
  Space,
  Divider,
  Empty,
  Progress,
  Typography,
  Modal,
  message,
} from "antd";
import {
  UserOutlined,
  DeleteOutlined,
  PlusOutlined,
  MailOutlined,
  StarFilled,
  CommentOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

// Mock data based on your structure
const mockRatings = [
  {
    id: 1,
    rating: 5,
    comment:
      "Absolutely amazing service! The team went above and beyond my expectations. Highly recommended for anyone looking for quality work.",
    clientEmail: "beingsazzad@gmail.com",
  },
  {
    id: 2,
    rating: 4,
    comment:
      "Great experience overall. Professional team and timely delivery. Would definitely work with them again.",
    clientEmail: "john.doe@example.com",
  },
  {
    id: 3,
    rating: 5,
    comment:
      "Outstanding quality and attention to detail. The final product exceeded what I had in mind.",
    clientEmail: "sarah.wilson@gmail.com",
  },
  {
    id: 4,
    rating: 3,
    comment:
      "Good service but there's room for improvement in communication during the project.",
    clientEmail: "mike.johnson@yahoo.com",
  },
];

function Ratings() {
  const [ratings, setRatings] = useState(mockRatings);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form] = Form.useForm();

  const handleAddRating = (values) => {
    const newRating = {
      id: Date.now(),
      ...values,
    };
    setRatings([newRating, ...ratings]);
    form.resetFields();
    setShowAddForm(false);
    message.success("Rating submitted successfully!");
  };

  const handleDeleteRating = (id) => {
    Modal.confirm({
      title: "Delete Rating",
      content: "Are you sure you want to delete this rating?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        setRatings(ratings.filter((rating) => rating.id !== id));
        message.success("Rating deleted successfully!");
      },
    });
  };

  const getAverageRating = () => {
    if (ratings.length === 0) return 0;
    const total = ratings.reduce((sum, rating) => sum + rating.rating, 0);
    return (total / ratings.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    ratings.forEach((rating) => {
      distribution[rating.rating]++;
    });
    return distribution;
  };

  const distribution = getRatingDistribution();

  const getProgressColor = (rating) => {
    const colors = {
      5: "#52c41a",
      4: "#87d068",
      3: "#faad14",
      2: "#ff7a45",
      1: "#ff4d4f",
    };
    return colors[rating];
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "24px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header Section */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <Title
            level={1}
            style={{
              fontSize: "3rem",
              background: "linear-gradient(45deg, #fff, #e0e7ff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "16px",
            }}
          >
            Customer Ratings
          </Title>
          <Text style={{ fontSize: "18px", color: "rgba(255,255,255,0.8)" }}>
            See what our clients are saying about us
          </Text>
        </div>

        {/* Stats Overview */}
        <Row gutter={[24, 24]} style={{ marginBottom: "48px" }}>
          <Col xs={24} md={8}>
            <Card
              style={{
                borderRadius: "16px",
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(10px)",
                border: "none",
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <Text type="secondary">Average Rating</Text>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <Title level={2} style={{ margin: 0, color: "#1890ff" }}>
                      {getAverageRating()}
                    </Title>
                    <Rate
                      disabled
                      value={Math.round(getAverageRating())}
                      style={{ fontSize: "20px" }}
                    />
                  </div>
                </div>
                <StarFilled style={{ fontSize: "32px", color: "#faad14" }} />
              </div>
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card
              style={{
                borderRadius: "16px",
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(10px)",
                border: "none",
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              }}
            >
              <Statistic
                title="Total Reviews"
                value={ratings.length}
                prefix={<CommentOutlined />}
                valueStyle={{ color: "#52c41a", fontSize: "2rem" }}
              />
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card
              style={{
                borderRadius: "16px",
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(10px)",
                border: "none",
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              }}
            >
              <Text
                type="secondary"
                style={{ marginBottom: "16px", display: "block" }}
              >
                Rating Distribution
              </Text>
              <Space direction="vertical" style={{ width: "100%" }}>
                {[5, 4, 3, 2, 1].map((star) => (
                  <div
                    key={star}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Text style={{ minWidth: "12px" }}>{star}</Text>
                    <StarFilled
                      style={{ color: "#faad14", fontSize: "14px" }}
                    />
                    <Progress
                      percent={
                        ratings.length > 0
                          ? (distribution[star] / ratings.length) * 100
                          : 0
                      }
                      showInfo={false}
                      strokeColor={getProgressColor(star)}
                      style={{ flex: 1 }}
                    />
                    <Text
                      type="secondary"
                      style={{ minWidth: "20px", textAlign: "center" }}
                    >
                      {distribution[star]}
                    </Text>
                  </div>
                ))}
              </Space>
            </Card>
          </Col>
        </Row>

        {/* Add Rating Button */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => setShowAddForm(!showAddForm)}
            style={{
              borderRadius: "24px",
              height: "48px",
              fontSize: "16px",
              background: "linear-gradient(45deg, #1890ff, #722ed1)",
              border: "none",
              boxShadow: "0 4px 16px rgba(24,144,255,0.3)",
            }}
          >
            Add New Rating
          </Button>
        </div>

        {/* Add Rating Form */}
        {showAddForm && (
          <Card
            style={{
              borderRadius: "16px",
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(10px)",
              border: "none",
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              marginBottom: "32px",
            }}
          >
            <Title level={3} style={{ color: "#1890ff", marginBottom: "24px" }}>
              Add New Rating
            </Title>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleAddRating}
              initialValues={{ rating: 5 }}
            >
              <Form.Item
                name="rating"
                label="Rating"
                rules={[{ required: true, message: "Please select a rating!" }]}
              >
                <Rate style={{ fontSize: "32px" }} />
              </Form.Item>

              <Form.Item
                name="clientEmail"
                label="Email"
                rules={[
                  { required: true, message: "Please enter your email!" },
                  { type: "email", message: "Please enter a valid email!" },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="your.email@example.com"
                  style={{ borderRadius: "8px" }}
                />
              </Form.Item>

              <Form.Item
                name="comment"
                label="Comment"
                rules={[
                  { required: true, message: "Please enter your comment!" },
                ]}
              >
                <TextArea
                  rows={4}
                  placeholder="Share your experience..."
                  style={{ borderRadius: "8px" }}
                />
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{
                      borderRadius: "8px",
                      background: "linear-gradient(45deg, #52c41a, #73d13d)",
                      border: "none",
                    }}
                  >
                    Submit Rating
                  </Button>
                  <Button
                    onClick={() => setShowAddForm(false)}
                    style={{ borderRadius: "8px" }}
                  >
                    Cancel
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        )}

        {/* Ratings Grid */}
        <Row gutter={[24, 24]}>
          {ratings.map((rating) => (
            <Col xs={24} lg={12} key={rating.id}>
              <Card
                style={{
                  borderRadius: "16px",
                  background: "rgba(255,255,255,0.95)",
                  backdropFilter: "blur(10px)",
                  border: "none",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                  transition: "all 0.3s ease",
                  ":hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
                  },
                }}
                actions={[
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteRating(rating.id)}
                    style={{ color: "#ff4d4f" }}
                  >
                    Delete
                  </Button>,
                ]}
              >
                <Card.Meta
                  avatar={
                    <Avatar
                      size={48}
                      style={{
                        background: "linear-gradient(45deg, #1890ff, #722ed1)",
                        fontSize: "18px",
                        fontWeight: "bold",
                      }}
                      icon={<UserOutlined />}
                    >
                      {rating.clientEmail.charAt(0).toUpperCase()}
                    </Avatar>
                  }
                  title={
                    <div>
                      <Rate
                        disabled
                        value={rating.rating}
                        style={{ fontSize: "16px" }}
                      />
                      <div style={{ marginTop: "4px" }}>
                        <Text type="secondary" style={{ fontSize: "14px" }}>
                          <MailOutlined style={{ marginRight: "4px" }} />
                          {rating.clientEmail}
                        </Text>
                      </div>
                    </div>
                  }
                  description={
                    <div style={{ marginTop: "16px" }}>
                      <div
                        style={{
                          background: "#f5f5f5",
                          padding: "16px",
                          borderRadius: "8px",
                          marginBottom: "12px",
                        }}
                      >
                        <Paragraph style={{ margin: 0, fontStyle: "italic" }}>
                          "{rating.comment}"
                        </Paragraph>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                          Rating: {rating.rating}/5
                        </Text>
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                          Verified Review
                        </Text>
                      </div>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>

        {ratings.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px" }}>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div>
                  <Title level={4} style={{ color: "rgba(255,255,255,0.8)" }}>
                    No ratings yet
                  </Title>
                  <Text style={{ color: "rgba(255,255,255,0.6)" }}>
                    Be the first to leave a rating!
                  </Text>
                </div>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Ratings;
