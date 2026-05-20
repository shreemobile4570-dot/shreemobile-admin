import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getOrders, updateAOrder } from "../features/auth/authSlice";

const orderSteps = ["Ordered", "Processed", "Shipped", "Out for Delivery", "Delivered"];

const Orders = () => {
  const dispatch = useDispatch();
  const orderState = useSelector((state) => state?.auth?.orders?.orders);

  useEffect(() => {
    dispatch(getOrders({ params: { limit: 100 } }));
  }, [dispatch]);

  const updateOrderStatus = async (id, status) => {
    await dispatch(updateAOrder({ id, status }));
    dispatch(getOrders({ params: { limit: 100 } }));
  };

  const getStepIndex = (status) => {
    const index = orderSteps.findIndex(
      (step) => step.toLowerCase() === String(status || "").toLowerCase()
    );
    return index >= 0 ? index : 0;
  };

  const getCustomerName = (order) =>
    `${order?.shippingInfo?.firstname || order?.user?.firstname || ""} ${
      order?.shippingInfo?.lastname || order?.user?.lastname || ""
    }`.trim() || "Customer";

  return (
    <div className="admin-orders-page">
      <div className="admin-page-head">
        <div>
          <span>Operations</span>
          <h3 className="title mb-0">Orders</h3>
        </div>
        <p>{orderState?.length || 0} order{orderState?.length === 1 ? "" : "s"}</p>
      </div>

      {!orderState?.length && <div className="admin-empty-state">No orders found.</div>}

      <div className="admin-orders-list">
        {orderState?.map((order) => {
          const activeStep = getStepIndex(order?.orderStatus);
          const progressPercent =
            orderSteps.length > 1 ? (activeStep / (orderSteps.length - 1)) * 100 : 0;
          const paymentMethod = order?.paymentMethod || order?.paymentInfo?.paymentMethod || "N/A";
          const paymentStatus = order?.paymentStatus || order?.paymentInfo?.paymentStatus || "pending";

          return (
            <article className="admin-order-card" key={order?._id}>
              <div className="admin-order-top">
                <div>
                  <span className="admin-order-label">Order ID</span>
                  <h4>{order?._id}</h4>
                  <p>{order?.createdAt ? new Date(order.createdAt).toLocaleString() : ""}</p>
                </div>
                <span className="admin-order-status">{order?.orderStatus || "Ordered"}</span>
              </div>

              <div className="admin-order-summary">
                <div>
                  <span>Total</span>
                  <strong>Rs. {order?.totalPrice || 0}</strong>
                </div>
                <div>
                  <span>Payable</span>
                  <strong>Rs. {order?.totalPriceAfterDiscount || order?.totalPrice || 0}</strong>
                </div>
                <div>
                  <span>Payment</span>
                  <strong>{paymentMethod}</strong>
                </div>
                <div>
                  <span>Status</span>
                  <strong className={paymentStatus === "paid" ? "green" : "admin-warn"}>
                    {paymentStatus}
                  </strong>
                </div>
                <div>
                  <span>Items</span>
                  <strong>{order?.orderItems?.length || 0}</strong>
                </div>
              </div>

              <div className="admin-order-body">
                <section className="admin-customer-card">
                  <span className="admin-order-label">Customer Details</span>
                  <h5>{getCustomerName(order)}</h5>
                  <p>{order?.user?.email || "Email not available"}</p>
                  <p>{order?.user?.mobile || "Phone not available"}</p>
                  <address>
                    {order?.shippingInfo?.address || "Address not available"}
                    {order?.shippingInfo?.other ? `, ${order.shippingInfo.other}` : ""}
                    <br />
                    {order?.shippingInfo?.city || "-"} - {order?.shippingInfo?.pincode || "-"}
                    {order?.shippingInfo?.state ? `, ${order.shippingInfo.state}` : ""}
                  </address>
                </section>

                <section className="admin-order-items">
                  <span className="admin-order-label">Products</span>
                  {order?.orderItems?.slice(0, 3).map((item, index) => (
                    <div className="admin-order-item" key={`${order?._id}-${index}`}>
                      <div>
                        <strong>{item?.product?.title || "Product"}</strong>
                        <p>Qty: {item?.quantity} | Rs. {item?.price}</p>
                      </div>
                      {item?.isAvailable === false && (
                        <span className="admin-unavailable">Not available</span>
                      )}
                    </div>
                  ))}
                  {(order?.orderItems?.length || 0) > 3 && (
                    <p className="admin-more-items">+{order.orderItems.length - 3} more product(s)</p>
                  )}
                </section>
              </div>

              <div className="admin-order-progress" aria-label={`Order status ${order?.orderStatus}`}>
                <div className="admin-order-track">
                  <div
                    className="admin-order-fill"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
                <div className="admin-order-steps">
                  {orderSteps.map((step, index) => (
                    <div
                      key={step}
                      className={`admin-order-step ${index <= activeStep ? "complete" : ""}`}
                    >
                      <span>{index + 1}</span>
                      <p>{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="admin-order-actions">
                <Link className="admin-view-order" to={`/admin/order/${order?._id}`}>
                  Checklist
                </Link>
                <select
                  value={order?.orderStatus || "Ordered"}
                  onChange={(e) => updateOrderStatus(order?._id, e.target.value)}
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
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
