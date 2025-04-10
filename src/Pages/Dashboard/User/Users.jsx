import { ConfigProvider, Input, Modal, Table } from "antd";
import moment from "moment";
import React, { useState } from "react";
import { FiEye } from "react-icons/fi";
import { useUsersQuery } from "../../../redux/apiSlices/userSlice";
import { imageUrl } from "../../../redux/api/baseApi";

const data = [
  {
    key: "1",
    invoiceNo: "10",
    time: "18 Jul, 2023  4:30pm",
    username: "Tushar",
    method: "Credit Card",
    amount: "$850.00",
    status: "complete",
    printView: "Button",
  },
  {
    key: "2",
    invoiceNo: "11",
    time: "18 Jul, 2023  4:30pm",
    username: "Tushar",
    method: "Credit Card",
    amount: "$850.00",
    status: "complete",
    printView: "Button",
  },
  {
    key: "3",
    invoiceNo: "12",
    time: "18 Jul, 2023  4:30pm",
    username: "Tushar",
    method: "Credit Card",
    amount: "$850.00",
    status: "complete",
    printView: "Button",
  },
  {
    key: "4",
    invoiceNo: "13",
    time: "18 Jul, 2023  4:30pm",
    username: "Tushar",
    method: "Credit Card",
    amount: "$850.00",
    status: "complete",
    printView: "Button",
  },
  {
    key: "5",
    invoiceNo: "14",
    time: "18 Jul, 2023  4:30pm",
    username: "Tushar",
    method: "Credit Card",
    amount: "$850.00",
    status: "complete",
    printView: "Button",
  },

  {
    key: "6",
    invoiceNo: "12",
    time: "18 Jul, 2023  4:30pm",
    username: "Tushar",
    method: "Credit Card",
    amount: "$850.00",
    status: "complete",
    printView: "Button",
  },
  {
    key: "7",
    invoiceNo: "13",
    time: "18 Jul, 2023  4:30pm",
    username: "Tushar",
    method: "Credit Card",
    amount: "$850.00",
    status: "complete",
    printView: "Button",
  },
  {
    key: "8",
    invoiceNo: "14",
    time: "18 Jul, 2023  4:30pm",
    username: "Tushar",
    method: "Credit Card",
    amount: "$850.00",
    status: "complete",
    printView: "Button",
  },

  {
    key: "9",
    invoiceNo: "12",
    time: "18 Jul, 2023  4:30pm",
    username: "Tushar",
    method: "Credit Card",
    amount: "$850.00",
    status: "complete",
    printView: "Button",
  },
  {
    key: "10",
    invoiceNo: "13",
    time: "18 Jul, 2023  4:30pm",
    username: "Tushar",
    method: "Credit Card",
    amount: "$850.00",
    status: "complete",
    printView: "Button",
  },
];

const Users = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const { data: users } = useUsersQuery({ page: page, search: search });
  const [value, setValue] = useState(null);

  const columns = [
    {
      title: "Serial No.",
      dataIndex: "name",
      key: "name",
      render: (_, record, index) => (
        <p>{(page - 1) * itemsPerPage + index + 1}</p>
      ),
    },
    {
      title: "Artist",
      dataIndex: "artist",
      key: "artist",
      render: (_, record, index) => (
        <div className="flex items-center gap-2">
          <img
            src={
              record?.image?.startsWith("https")
                ? record?.image
                : `${imageUrl}${record?.image}`
            }
            style={{ height: 50, width: 50, borderRadius: 8 }}
            alt=""
          />
          <p>
            {record?.firstName} {record?.lastName}
          </p>
        </div>
      ),
    },
    {
      title: "EMAIL",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "CONTACT",
      dataIndex: "mobileNumber",
      key: "mobileNumber",
    },
    {
      title: "DATE",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (_, record) => <p>{moment(record?.createdAt).format("L")}</p>,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (_, record) => <p> {record?.appId ? "Social" : "General"}</p>,
    },
    {
      title: "ACTIONS",
      dataIndex: "actions",
      key: "actions",
      render: (_, record) => (
        <FiEye
          size={22}
          color="#999999"
          onClick={() => setValue(record)}
          className={"cursor-pointer"}
        />
      ),
    },
  ];
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 style={{ fontSize: "25px", fontWeight: "normal" }}>Users</h2>
        <Input
          style={{
            width: 300,
            height: 40,
            outline: "none",
            border: "1px solid #d9d9d9",
            boxShadow: "none",
          }}
          placeholder="Search by Date"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <ConfigProvider
        theme={{
          components: {
            Pagination: {
              itemActiveBg: "#6C57EC",
              borderRadius: "100%",
            },
          },
          token: {
            colorPrimary: "white",
          },
        }}
      >
        <Table
          columns={columns}
          dataSource={users?.data}
          pagination={{
            current: parseInt(page),
            onChange: (page) => setPage(page),
          }}
        />
      </ConfigProvider>

      <Modal
        open={value}
        onCancel={() => setValue(null)}
        onClose={() => setValue(null)}
        footer={false}
      >
        <div>
          <img
            width={120}
            style={{ borderRadius: "12px", margin: "0 auto" }}
            src={
              value?.image?.startsWith("https")
                ? value?.image
                : `${imageUrl}${value?.image}`
            }
            alt=""
          />

          <div className="flex items-center justify-between mt-[15px]">
            <div>
              <p className="pb-[5px]">Artish Name:</p>
              <p className="pb-[5px]">Email</p>
              <p className="pb-[5px]">Contact</p>
              <p className="">Type</p>
            </div>

            <div>
              <p className="pb-[5px] text-right">
                {value?.firstName} {value?.firstName}{" "}
              </p>
              <p className="pb-[5px] text-right">
                {value?.email ? value?.email : "Not Added yet"}
              </p>
              <p className="pb-[5px] text-right">
                {value?.mobileNumber ? value?.mobileNumber : "Not Added yet"}
              </p>
              <p className="text-right">
                {value?.appId ? "Social" : "General"}
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Users;
