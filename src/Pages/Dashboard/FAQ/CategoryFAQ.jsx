// import React, { useState } from "react";
// import { Collapse, Modal, Form, Input, Select, Button, message } from "antd";
// import {
//   PlusOutlined,
//   CaretRightOutlined,
//   EditOutlined,
//   DeleteOutlined,
// } from "@ant-design/icons";

// const { Panel } = Collapse;
// const { Option } = Select;

// const CategoryFAQ = () => {
//   // State for categories and FAQs
//   const [categories, setCategories] = useState([
//     { id: "1", name: "General" },
//     { id: "2", name: "Pricing" },
//     { id: "3", name: "Support" },
//   ]);

//   const [faqs, setFaqs] = useState([
//     {
//       id: "1",
//       categoryId: "1",
//       question: "What is this service about?",
//       answer:
//         "This service helps you manage and organize frequently asked questions by categories.",
//     },
//     {
//       id: "2",
//       categoryId: "1",
//       question: "How do I get started?",
//       answer:
//         "Simply add a category, then add questions and answers within that category.",
//     },
//     {
//       id: "3",
//       categoryId: "2",
//       question: "How much does it cost?",
//       answer:
//         "Our pricing is flexible based on your needs. Contact sales for more information.",
//     },
//     {
//       id: "4",
//       categoryId: "3",
//       question: "How can I get help?",
//       answer: "You can reach our support team via email or phone 24/7.",
//     },
//   ]);

//   // Modal states
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalType, setModalType] = useState("faq"); // "faq" or "category"
//   const [editItem, setEditItem] = useState(null);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [itemToDelete, setItemToDelete] = useState(null);
//   const [deleteType, setDeleteType] = useState(""); // "faq" or "category"

//   // Form instance
//   const [form] = Form.useForm();

//   // Active keys for collapse
//   const [activeKeys, setActiveKeys] = useState(["1"]);

//   // Show modal to add a new FAQ
//   const showAddFAQModal = () => {
//     setModalType("faq");
//     setEditItem(null);
//     form.resetFields();
//     setIsModalOpen(true);
//   };

//   // Show modal to add a new category
//   const showAddCategoryModal = () => {
//     setModalType("category");
//     setEditItem(null);
//     form.resetFields();
//     setIsModalOpen(true);
//   };

//   // Show modal to edit an FAQ
//   const showEditFAQModal = (faq) => {
//     setModalType("faq");
//     setEditItem(faq);
//     form.setFieldsValue({
//       categoryId: faq.categoryId,
//       question: faq.question,
//       answer: faq.answer,
//     });
//     setIsModalOpen(true);
//   };

//   // Show modal to edit a category
//   const showEditCategoryModal = (category) => {
//     setModalType("category");
//     setEditItem(category);
//     form.setFieldsValue({
//       name: category.name,
//     });
//     setIsModalOpen(true);
//   };

//   // Show delete confirmation modal
//   const showDeleteModal = (item, type) => {
//     setItemToDelete(item);
//     setDeleteType(type);
//     setIsDeleteModalOpen(true);
//   };

//   // Handle save for both FAQ and Category
//   const handleSave = (values) => {
//     if (modalType === "faq") {
//       handleSaveFAQ(values);
//     } else {
//       handleSaveCategory(values);
//     }
//   };

//   // Handle save for FAQ
//   const handleSaveFAQ = (values) => {
//     if (editItem) {
//       // Update existing FAQ
//       setFaqs(
//         faqs.map((item) =>
//           item.id === editItem.id ? { ...item, ...values } : item
//         )
//       );
//       message.success("FAQ updated successfully!");
//     } else {
//       // Add new FAQ
//       const newId = (
//         Math.max(...faqs.map((faq) => parseInt(faq.id)), 0) + 1
//       ).toString();
//       setFaqs([...faqs, { id: newId, ...values }]);
//       message.success("FAQ added successfully!");
//     }
//     setIsModalOpen(false);
//   };

//   // Handle save for Category
//   const handleSaveCategory = (values) => {
//     if (editItem) {
//       // Update existing category
//       setCategories(
//         categories.map((item) =>
//           item.id === editItem.id ? { ...item, ...values } : item
//         )
//       );
//       message.success("Category updated successfully!");
//     } else {
//       // Add new category
//       const newId = (
//         Math.max(...categories.map((cat) => parseInt(cat.id)), 0) + 1
//       ).toString();
//       setCategories([...categories, { id: newId, ...values }]);
//       message.success("Category added successfully!");
//     }
//     setIsModalOpen(false);
//   };

//   // Handle delete for both FAQ and Category
//   const handleDelete = () => {
//     if (deleteType === "faq") {
//       setFaqs(faqs.filter((faq) => faq.id !== itemToDelete.id));
//       message.success("FAQ deleted successfully!");
//     } else {
//       // Delete category and all FAQs in that category
//       setCategories(categories.filter((cat) => cat.id !== itemToDelete.id));
//       setFaqs(faqs.filter((faq) => faq.categoryId !== itemToDelete.id));
//       message.success("Category and its FAQs deleted successfully!");
//     }
//     setIsDeleteModalOpen(false);
//   };

//   // Group FAQs by category
//   const getFAQsByCategory = () => {
//     return categories.map((category) => {
//       const categoryFaqs = faqs.filter((faq) => faq.categoryId === category.id);

//       return {
//         categoryId: category.id,
//         categoryName: category.name,
//         faqs: categoryFaqs,
//       };
//     });
//   };

//   return (
//     <div className="max-w-4xl mx-auto">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Category-based FAQs</h1>
//         <div className="flex gap-3">
//           <Button
//             type="primary"
//             icon={<PlusOutlined />}
//             onClick={showAddCategoryModal}
//             className="bg-blue-600"
//           >
//             Add Category
//           </Button>
//           <Button
//             type="primary"
//             icon={<PlusOutlined />}
//             onClick={showAddFAQModal}
//             className="bg-green-600"
//           >
//             Add FAQ
//           </Button>
//         </div>
//       </div>

//       {/* Display Categories and FAQs */}

//       <div className="min-h-[90%] overflow-auto">
//         <div className="space-y-6  ">
//           {getFAQsByCategory().map((categoryGroup) => (
//             <div
//               key={categoryGroup.categoryId}
//               className="bg-white rounded-lg shadow-md"
//             >
//               <div className="flex justify-between items-center px-6 py-4 bg-gray-100 rounded-t-lg">
//                 <h2 className="text-xl font-semibold">
//                   {categoryGroup.categoryName}
//                 </h2>
//                 <div className="flex gap-2">
//                   <Button
//                     type="text"
//                     icon={<EditOutlined />}
//                     onClick={() =>
//                       showEditCategoryModal({
//                         id: categoryGroup.categoryId,
//                         name: categoryGroup.categoryName,
//                       })
//                     }
//                     className="text-blue-600 hover:text-blue-800"
//                   >
//                     Edit
//                   </Button>
//                   <Button
//                     type="text"
//                     icon={<DeleteOutlined />}
//                     onClick={() =>
//                       showDeleteModal(
//                         {
//                           id: categoryGroup.categoryId,
//                           name: categoryGroup.categoryName,
//                         },
//                         "category"
//                       )
//                     }
//                     className="text-red-600 hover:text-red-800"
//                     danger
//                   >
//                     Delete
//                   </Button>
//                 </div>
//               </div>

//               {categoryGroup.faqs.length > 0 ? (
//                 <Collapse
//                   bordered={false}
//                   expandIcon={({ isActive }) => (
//                     <CaretRightOutlined rotate={isActive ? 90 : 0} />
//                   )}
//                   className="bg-white"
//                 >
//                   {categoryGroup.faqs.map((faq) => (
//                     <Panel
//                       key={faq.id}
//                       header={
//                         <div className="flex justify-between items-center w-full pr-8">
//                           <span>{faq.question}</span>
//                           <div
//                             className="flex gap-2"
//                             onClick={(e) => e.stopPropagation()}
//                           >
//                             <Button
//                               type="text"
//                               icon={<EditOutlined />}
//                               onClick={() => showEditFAQModal(faq)}
//                               className="text-blue-600 hover:text-blue-800"
//                             >
//                               Edit
//                             </Button>
//                             <Button
//                               type="text"
//                               icon={<DeleteOutlined />}
//                               onClick={() => showDeleteModal(faq, "faq")}
//                               className="text-red-600 hover:text-red-800"
//                               danger
//                             >
//                               Delete
//                             </Button>
//                           </div>
//                         </div>
//                       }
//                     >
//                       <div className="pl-4 border-l-2 border-blue-500">
//                         <p>{faq.answer}</p>
//                       </div>
//                     </Panel>
//                   ))}
//                 </Collapse>
//               ) : (
//                 <div className="p-6 text-center text-gray-500">
//                   No FAQs in this category yet
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//       {/* Add/Edit Modal */}
//       <Modal
//         title={`${editItem ? "Edit" : "Add"} ${
//           modalType === "faq" ? "FAQ" : "Category"
//         }`}
//         open={isModalOpen}
//         onCancel={() => setIsModalOpen(false)}
//         footer={null}
//         width={600}
//       >
//         <Form
//           form={form}
//           layout="vertical"
//           onFinish={handleSave}
//           className="mt-4"
//         >
//           {modalType === "category" ? (
//             <Form.Item
//               label="Category Name"
//               name="name"
//               rules={[
//                 { required: true, message: "Please enter category name" },
//               ]}
//             >
//               <Input placeholder="Enter category name" />
//             </Form.Item>
//           ) : (
//             <>
//               <Form.Item
//                 label="Category"
//                 name="categoryId"
//                 rules={[
//                   { required: true, message: "Please select a category" },
//                 ]}
//               >
//                 <Select placeholder="Select category">
//                   {categories.map((category) => (
//                     <Option key={category.id} value={category.id}>
//                       {category.name}
//                     </Option>
//                   ))}
//                 </Select>
//               </Form.Item>
//               <Form.Item
//                 label="Question"
//                 name="question"
//                 rules={[
//                   { required: true, message: "Please enter the question" },
//                 ]}
//               >
//                 <Input placeholder="Enter the question" />
//               </Form.Item>
//               <Form.Item
//                 label="Answer"
//                 name="answer"
//                 rules={[{ required: true, message: "Please enter the answer" }]}
//               >
//                 <Input.TextArea rows={5} placeholder="Enter the answer" />
//               </Form.Item>
//             </>
//           )}

//           <div className="flex justify-end gap-3 mt-6">
//             <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
//             <Button type="primary" htmlType="submit">
//               Save
//             </Button>
//           </div>
//         </Form>
//       </Modal>

//       {/* Delete Confirmation Modal */}
//       <Modal
//         title={`Delete ${deleteType === "faq" ? "FAQ" : "Category"}`}
//         open={isDeleteModalOpen}
//         onCancel={() => setIsDeleteModalOpen(false)}
//         footer={null}
//       >
//         <p>
//           {deleteType === "faq"
//             ? "Are you sure you want to delete this FAQ?"
//             : "Are you sure you want to delete this category? All FAQs in this category will also be deleted."}
//         </p>
//         <div className="flex justify-end gap-3 mt-6">
//           <Button onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
//           <Button type="primary" danger onClick={handleDelete}>
//             Delete
//           </Button>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default CategoryFAQ;

import React, { useState } from "react";
import { Collapse, Modal, Form, Input, Select, Button, message } from "antd";
import {
  PlusOutlined,
  CaretRightOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const { Panel } = Collapse;
const { Option } = Select;

const CategoryFAQ = () => {
  // State for categories and FAQs
  const [categories, setCategories] = useState([
    { id: "1", name: "General" },
    { id: "2", name: "Pricing" },
    { id: "3", name: "Support" },
  ]);

  const [faqs, setFaqs] = useState([
    {
      id: "1",
      categoryId: "1",
      question: "What is this service about?",
      answer:
        "This service helps you manage and organize frequently asked questions by categories.",
    },
    {
      id: "2",
      categoryId: "1",
      question: "How do I get started?",
      answer:
        "Simply add a category, then add questions and answers within that category.",
    },
    {
      id: "3",
      categoryId: "2",
      question: "How much does it cost?",
      answer:
        "Our pricing is flexible based on your needs. Contact sales for more information.",
    },
    {
      id: "4",
      categoryId: "3",
      question: "How can I get help?",
      answer: "You can reach our support team via email or phone 24/7.",
    },
  ]);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("faq"); // "faq" or "category"
  const [editItem, setEditItem] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState(""); // "faq" or "category"

  // Form instance
  const [form] = Form.useForm();

  // Active keys for collapse
  const [activeKeys, setActiveKeys] = useState(["1"]);

  // Show modal to add a new FAQ
  const showAddFAQModal = () => {
    setModalType("faq");
    setEditItem(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  // Show modal to add a new category
  const showAddCategoryModal = () => {
    setModalType("category");
    setEditItem(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  // Show modal to edit an FAQ
  const showEditFAQModal = (faq) => {
    setModalType("faq");
    setEditItem(faq);
    form.setFieldsValue({
      categoryId: faq.categoryId,
      question: faq.question,
      answer: faq.answer,
    });
    setIsModalOpen(true);
  };

  // Show modal to edit a category
  const showEditCategoryModal = (category) => {
    setModalType("category");
    setEditItem(category);
    form.setFieldsValue({
      name: category.name,
    });
    setIsModalOpen(true);
  };

  // Show delete confirmation modal
  const showDeleteModal = (item, type) => {
    setItemToDelete(item);
    setDeleteType(type);
    setIsDeleteModalOpen(true);
  };

  // Handle save for both FAQ and Category
  const handleSave = (values) => {
    if (modalType === "faq") {
      handleSaveFAQ(values);
    } else {
      handleSaveCategory(values);
    }
  };

  // Handle save for FAQ
  const handleSaveFAQ = (values) => {
    if (editItem) {
      // Update existing FAQ
      setFaqs(
        faqs.map((item) =>
          item.id === editItem.id ? { ...item, ...values } : item
        )
      );
      message.success("FAQ updated successfully!");
    } else {
      // Add new FAQ
      const newId = (
        Math.max(...faqs.map((faq) => parseInt(faq.id)), 0) + 1
      ).toString();
      setFaqs([...faqs, { id: newId, ...values }]);
      message.success("FAQ added successfully!");
    }
    setIsModalOpen(false);
  };

  // Handle save for Category
  const handleSaveCategory = (values) => {
    if (editItem) {
      // Update existing category
      setCategories(
        categories.map((item) =>
          item.id === editItem.id ? { ...item, ...values } : item
        )
      );
      message.success("Category updated successfully!");
    } else {
      // Add new category
      const newId = (
        Math.max(...categories.map((cat) => parseInt(cat.id)), 0) + 1
      ).toString();
      setCategories([...categories, { id: newId, ...values }]);
      message.success("Category added successfully!");
    }
    setIsModalOpen(false);
  };

  // Handle delete for both FAQ and Category
  const handleDelete = () => {
    if (deleteType === "faq") {
      setFaqs(faqs.filter((faq) => faq.id !== itemToDelete.id));
      message.success("FAQ deleted successfully!");
    } else {
      // Delete category and all FAQs in that category
      setCategories(categories.filter((cat) => cat.id !== itemToDelete.id));
      setFaqs(faqs.filter((faq) => faq.categoryId !== itemToDelete.id));
      message.success("Category and its FAQs deleted successfully!");
    }
    setIsDeleteModalOpen(false);
  };

  // Group FAQs by category
  const getFAQsByCategory = () => {
    return categories.map((category) => {
      const categoryFaqs = faqs.filter((faq) => faq.categoryId === category.id);

      return {
        categoryId: category.id,
        categoryName: category.name,
        faqs: categoryFaqs,
      };
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Category-based FAQs</h1>
        <div className="flex gap-3">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={showAddCategoryModal}
            className="bg-blue-600"
          >
            Add Category
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={showAddFAQModal}
            className="bg-green-600"
          >
            Add FAQ
          </Button>
        </div>
      </div>

      {/* Display Categories and FAQs */}
      <div
        className="h-[40em] overflow-y-auto [&::-webkit-scrollbar]:w-0
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
      >
        <div className="space-y-6">
          {getFAQsByCategory().map((categoryGroup) => (
            <div
              key={categoryGroup.categoryId}
              className="bg-white rounded-lg shadow-md"
            >
              <div className="flex justify-between items-center px-6 py-4 bg-gray-100 rounded-t-lg">
                <h2 className="text-xl font-semibold">
                  {categoryGroup.categoryName}
                </h2>
                <div className="flex gap-2">
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() =>
                      showEditCategoryModal({
                        id: categoryGroup.categoryId,
                        name: categoryGroup.categoryName,
                      })
                    }
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </Button>
                  <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    onClick={() =>
                      showDeleteModal(
                        {
                          id: categoryGroup.categoryId,
                          name: categoryGroup.categoryName,
                        },
                        "category"
                      )
                    }
                    className="text-red-600 hover:text-red-800"
                    danger
                  >
                    Delete
                  </Button>
                </div>
              </div>

              {categoryGroup.faqs.length > 0 ? (
                <Collapse
                  bordered={false}
                  expandIcon={({ isActive }) => (
                    <CaretRightOutlined rotate={isActive ? 90 : 0} />
                  )}
                  className="bg-white"
                >
                  {categoryGroup.faqs.map((faq) => (
                    <Panel
                      key={faq.id}
                      header={
                        <div className="flex justify-between items-center w-full pr-8">
                          <span>{faq.question}</span>
                          <div
                            className="flex gap-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button
                              type="text"
                              icon={<EditOutlined />}
                              onClick={() => showEditFAQModal(faq)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Edit
                            </Button>
                            <Button
                              type="text"
                              icon={<DeleteOutlined />}
                              onClick={() => showDeleteModal(faq, "faq")}
                              className="text-red-600 hover:text-red-800"
                              danger
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      }
                    >
                      <div className="pl-4 border-l-2 border-blue-500">
                        <p>{faq.answer}</p>
                      </div>
                    </Panel>
                  ))}
                </Collapse>
              ) : (
                <div className="p-6 text-center text-gray-500">
                  No FAQs in this category yet
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Add/Edit Modal */}
      <Modal
        title={`${editItem ? "Edit" : "Add"} ${
          modalType === "faq" ? "FAQ" : "Category"
        }`}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          className="mt-4"
        >
          {modalType === "category" ? (
            <Form.Item
              label="Category Name"
              name="name"
              rules={[
                { required: true, message: "Please enter category name" },
              ]}
            >
              <Input placeholder="Enter category name" />
            </Form.Item>
          ) : (
            <>
              <Form.Item
                label="Category"
                name="categoryId"
                rules={[
                  { required: true, message: "Please select a category" },
                ]}
              >
                <Select placeholder="Select category">
                  {categories.map((category) => (
                    <Option key={category.id} value={category.id}>
                      {category.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Question"
                name="question"
                rules={[
                  { required: true, message: "Please enter the question" },
                ]}
              >
                <Input placeholder="Enter the question" />
              </Form.Item>
              <Form.Item
                label="Answer"
                name="answer"
                rules={[{ required: true, message: "Please enter the answer" }]}
              >
                <Input.TextArea rows={5} placeholder="Enter the answer" />
              </Form.Item>
            </>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title={`Delete ${deleteType === "faq" ? "FAQ" : "Category"}`}
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        footer={null}
      >
        <p>
          {deleteType === "faq"
            ? "Are you sure you want to delete this FAQ?"
            : "Are you sure you want to delete this category? All FAQs in this category will also be deleted."}
        </p>
        <div className="flex justify-end gap-3 mt-6">
          <Button onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
          <Button type="primary" danger onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default CategoryFAQ;
