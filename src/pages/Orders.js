import React, { useEffect } from "react";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getOrders, updateAOrder } from "../features/auth/authSlice";

const Orders = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOrders({ params: { limit: 100 } }));
  }, [dispatch]);

  const orderState = useSelector((state) => state?.auth?.orders?.orders);

  // ✅ Columns
  const columns = [
    {
      title: "SNo",
      dataIndex: "key",
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Product",
      dataIndex: "product",
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Payment Mode",
      dataIndex: "paymentMethod",
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
    },
    {
      title: "Shipping Details",
      dataIndex: "shipping",
    },
    {
      title: "Date",
      dataIndex: "date",
    },
    {
      title: "Action",
      dataIndex: "action",
    },
  ];

  // ✅ Update Order Status
  const updateOrderStatus = async (id, status) => {
    await dispatch(updateAOrder({ id, status }));
    dispatch(getOrders({ params: { limit: 100 } }));
  };

  // ✅ Table Data
  const data1 = [];

  // for (let i = 0; i < (orderState?.length || 0); i++) {
  //   data1.push({
  //     key: i + 1,
  //     name: orderState[i]?.user?.firstname || "User",

  //     product: (
  //       <Link to={`/admin/order/${orderState[i]?._id}`}>
  //         View Orders
  //       </Link>
  //     ),

  //     amount: `₹ ${orderState[i]?.totalPrice || 0}`,

  //     // ✅ Payment Mode
  //     paymentMethod: orderState[i]?.paymentMethod || "N/A",

  //     // ✅ Payment Status with styling
  //     paymentStatus: (
  //       <span
  //         style={{
  //           color:
  //             orderState[i]?.paymentStatus === "paid"
  //               ? "green"
  //               : "orange",
  //           fontWeight: "bold",
  //           textTransform: "capitalize",
  //         }}
  //       >
  //         {orderState[i]?.paymentStatus || "pending"}
  //       </span>
  //     ),

  //     date: new Date(orderState[i]?.createdAt).toLocaleString(),

  //     action: (
  //       <select
  //         defaultValue={orderState[i]?.orderStatus}
  //         onChange={(e) =>
  //           updateOrderStatus(orderState[i]?._id, e.target.value)
  //         }
  //         className="form-control form-select"
  //       >
  //         <option value="Ordered" disabled>
  //           Ordered
  //         </option>
  //         <option value="Processed">Processed</option>
  //         <option value="Shipped">Shipped</option>
  //         <option value="Out for Delivery">Out for Delivery</option>
  //         <option value="Delivered">Delivered</option>
  //       </select>
  //     ),
  //   });
  // }
  for (let i = 0; i < (orderState?.length || 0); i++) {
  data1.push({
    key: i + 1,

    name: orderState[i]?.user?.firstname || "User",

    product: (
      <Link to={`/admin/order/${orderState[i]?._id}`}>
        View Orders
      </Link>
    ),

    amount: `₹ ${orderState[i]?.totalPrice || 0}`,

    // ✅ FIXED Payment Mode
    paymentMethod:
      orderState[i]?.paymentInfo?.paymentMethod || "N/A",

    // ✅ FIXED Payment Status
    paymentStatus: (
      <span
        style={{
          color:
            orderState[i]?.paymentInfo?.paymentStatus === "paid"
              ? "green"
              : "orange",
          fontWeight: "bold",
          textTransform: "capitalize",
        }}
      >
        {orderState[i]?.paymentInfo?.paymentStatus || "pending"}
      </span>
    ),

    // ✅ NEW SHIPPING UI (clean card style)
    shipping: (
      <div className="shipping-box">
        <strong>
          {orderState[i]?.shippingInfo?.firstname}{" "}
          {orderState[i]?.shippingInfo?.lastname}
        </strong>

        <div className="shipping-address">
          {orderState[i]?.shippingInfo?.address}
        </div>

        <div className="shipping-address">
          {orderState[i]?.shippingInfo?.other}
        </div>

        <div className="shipping-meta">
          {orderState[i]?.shippingInfo?.city} -{" "}
          {orderState[i]?.shippingInfo?.pincode}
        </div>
      </div>
    ),

    date: new Date(orderState[i]?.createdAt).toLocaleString(),

    action: (
      <select
        defaultValue={orderState[i]?.orderStatus}
        onChange={(e) =>
          updateOrderStatus(orderState[i]?._id, e.target.value)
        }
        className="form-control form-select"
      >
        <option value="Ordered" disabled>
          Ordered
        </option>
        <option value="Processed">Processed</option>
        <option value="Shipped">Shipped</option>
        <option value="Out for Delivery">Out for Delivery</option>
        <option value="Delivered">Delivered</option>
      </select>
    ),
  });
}

  return (
    <div>
      <h3 className="mb-4 title">Orders</h3>
      <Table columns={columns} dataSource={data1} />
    </div>
  );
};

export default Orders;
