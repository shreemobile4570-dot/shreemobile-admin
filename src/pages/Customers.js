/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { Button, Select, Table, Tag } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  blockCustomer,
  getUsers,
  unblockCustomer,
  updateCustomer,
} from "../features/cutomers/customerSlice";

const roleOptions = [
  { label: "Admin", value: "admin" },
  { label: "User", value: "user" },
  { label: "Wholeseller", value: "wholeseller" },
  { label: "Retailer", value: "retailer" },
];

const Customers = () => {
  const dispatch = useDispatch();
  const customerstate = useSelector((state) => state.customer.customers);
  const isLoading = useSelector((state) => state.customer.isLoading);

  useEffect(() => {
    dispatch(getUsers());
  }, []);

  const handleRoleChange = async (id, role) => {
    await dispatch(updateCustomer({ id, data: { role } }));
  };

  const handleBlockToggle = async (customer) => {
    if (customer.isBlocked) {
      await dispatch(unblockCustomer(customer._id));
    } else {
      await dispatch(blockCustomer(customer._id));
    }
  };

  const columns = [
    {
      title: "SNo",
      dataIndex: "key",
      width: 70,
    },
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
    },
    {
      title: "Address",
      dataIndex: "address",
      ellipsis: true,
    },
    {
      title: "Role",
      dataIndex: "role",
      render: (_, record) => (
        <Select
          value={record.role}
          options={roleOptions}
          style={{ minWidth: 135 }}
          onChange={(role) => handleRoleChange(record.id, role)}
        />
      ),
    },
    {
      title: "Status",
      dataIndex: "isBlocked",
      render: (isBlocked) =>
        isBlocked ? <Tag color="red">Blocked</Tag> : <Tag color="green">Active</Tag>,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <Button
          danger={!record.isBlocked}
          type={record.isBlocked ? "default" : "primary"}
          onClick={() => handleBlockToggle(record)}
        >
          {record.isBlocked ? "Unblock" : "Block"}
        </Button>
      ),
    },
  ];

  const data = customerstate.map((customer, index) => ({
    key: index + 1,
    id: customer._id,
    name: `${customer.firstname || ""} ${customer.lastname || ""}`.trim(),
    email: customer.email,
    mobile: customer.mobile,
    address: customer.address || "-",
    role: customer.role || "user",
    isBlocked: customer.isBlocked,
  }));

  return (
    <div className="admin-customers-page">
      <div className="admin-page-head">
        <div>
          <span>Accounts</span>
          <h3 className="title mb-0">Customers</h3>
        </div>
        <p>{data.length} customer{data.length === 1 ? "" : "s"}</p>
      </div>

      <div className="admin-desktop-table">
        <Table
          columns={columns}
          dataSource={data}
          loading={isLoading}
          scroll={{ x: 1100 }}
        />
      </div>

      <div className="admin-customer-cards">
        {data.map((customer) => (
          <article className="admin-customer-list-card" key={customer.id}>
            <div className="admin-customer-list-top">
              <div>
                <span className="admin-order-label">Customer</span>
                <h4>{customer.name || "Customer"}</h4>
                <p>{customer.email || "Email not available"}</p>
                <p>{customer.mobile || "Phone not available"}</p>
              </div>
              {customer.isBlocked ? (
                <Tag color="red">Blocked</Tag>
              ) : (
                <Tag color="green">Active</Tag>
              )}
            </div>

            <div className="admin-customer-address">
              {customer.address || "Address not available"}
            </div>

            <div className="admin-customer-actions">
              <Select
                value={customer.role}
                options={roleOptions}
                onChange={(role) => handleRoleChange(customer.id, role)}
              />
              <Button
                danger={!customer.isBlocked}
                type={customer.isBlocked ? "default" : "primary"}
                onClick={() => handleBlockToggle(customer)}
              >
                {customer.isBlocked ? "Unblock" : "Block"}
              </Button>
            </div>
          </article>
        ))}
        {isLoading && <div className="admin-empty-state">Loading customers...</div>}
      </div>
    </div>
  );
};

export default Customers;
