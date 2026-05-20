import React, { useEffect, useCallback } from "react";
import { Checkbox, Tag } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getaOrder,
  updateAOrder,
  updateOrderItemAvailabilityLocal,
} from "../features/auth/authSlice";

const ViewOrder = () => {
  const { id: orderId } = useParams();
  const dispatch = useDispatch();
  const { singleorder, isLoading, isError, message } = useSelector(
    (state) => state?.auth
  );

  const loadOrder = useCallback(() => {
    if (orderId) {
      dispatch(getaOrder(orderId));
    }
  }, [dispatch, orderId]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  const orderState = singleorder?.orders;
  const updateAvailability = async (itemId, isAvailable) => {
    const availabilityNote = isAvailable ? "" : "Currently not available";
    dispatch(
      updateOrderItemAvailabilityLocal({
        orderId,
        itemId,
        isAvailable,
        availabilityNote,
      })
    );

    try {
      await dispatch(
        updateAOrder({
          id: orderId,
          availabilityItems: [
            {
              itemId,
              isAvailable,
              availabilityNote,
            },
          ],
        })
      ).unwrap();
    } catch (error) {
      loadOrder();
    }
  };

  const updateOrderStatus = async (status) => {
    try {
      await dispatch(updateAOrder({ id: orderId, status })).unwrap();
    } catch (error) {
      loadOrder();
    }
  };

  return (
    <div className="admin-checklist-page">
      <div className="admin-page-head">
        <div>
          <span>Fulfilment</span>
          <h3 className="title mb-0">Order Checklist</h3>
        </div>
        {orderState && (
          <p>{orderState?.orderItems?.length || 0} product{orderState?.orderItems?.length === 1 ? "" : "s"}</p>
        )}
      </div>

      {isError && (
        <div className="alert alert-danger">
          {typeof message === "string" ? message : "Unable to load order"}
        </div>
      )}

      {orderState && (
        <div className="admin-checklist-toolbar">
          <div>
            <span className="admin-order-label">Order ID</span>
            <strong>{orderState?._id}</strong>
          </div>
          <div>
            <label className="form-label fw-semibold">Order Action</label>
            <select
              value={orderState?.orderStatus || "Ordered"}
              onChange={(e) => updateOrderStatus(e.target.value)}
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
        </div>
      )}

      {isLoading && !orderState && <div className="admin-empty-state">Loading order...</div>}

      <div className="admin-checklist-grid">
        {orderState?.orderItems?.map((item, index) => (
          <article className="admin-checklist-card" key={item?._id || index}>
            <div className="admin-checklist-top">
              <div>
                <span className="admin-order-label">Product {index + 1}</span>
                <h4>{item?.product?.title || "Product unavailable"}</h4>
                <p>{item?.product?.brand || "-"}</p>
              </div>
              {item?.isAvailable === false ? (
                <Tag color="red">Not available</Tag>
              ) : (
                <Tag color="green">Ready</Tag>
              )}
            </div>

            <div className="admin-checklist-meta">
              <span>Qty: <strong>{item?.quantity}</strong></span>
              <span>Rs. <strong>{item?.price}</strong></span>
              <span>Size: <strong>{item?.size?.title || "-"}</strong></span>
              <span className="admin-checklist-color">
                Color:
                <i style={{ backgroundColor: item?.color?.title || "#ddd" }}></i>
              </span>
            </div>

            <label className="admin-checklist-toggle">
              <Checkbox
                checked={item?.isAvailable !== false}
                onChange={(e) => updateAvailability(item?._id, e.target.checked)}
              />
              <span>{item?.isAvailable === false ? "Mark as available" : "Available for this order"}</span>
            </label>

            {item?.isAvailable === false && (
              <p className="admin-checklist-note">
                {item?.availabilityNote || "Currently not available"}
              </p>
            )}
          </article>
        ))}
      </div>

      {!isLoading && orderState && !orderState?.orderItems?.length && (
        <div className="admin-empty-state">No products found in this order.</div>
      )}
    </div>
  );
};

export default ViewOrder;
