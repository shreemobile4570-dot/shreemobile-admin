import React, { useEffect, useCallback } from "react";
import { Checkbox, Table, Tag } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getaOrder,
  updateAOrder,
  updateOrderItemAvailabilityLocal,
} from "../features/auth/authSlice";
const columns = [
  {
    title: "SNo",
    dataIndex: "key",
  },
  {
    title: "Product Name",
    dataIndex: "name",
  },
  {
    title: "Brand",
    dataIndex: "brand",
  },
  {
    title: "Count",
    dataIndex: "count",
  },
  {
    title: "Color",
    dataIndex: "color",
  },
  {
    title: "Size",
    dataIndex: "size",
  },
  {
    title: "Amount",
    dataIndex: "amount",
  },
  {
    title: "Available",
    dataIndex: "available",
  },
  {
    title: "Customer Note",
    dataIndex: "availabilityNote",
  },
];

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
        id: orderId,
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

  const data1 = (orderState?.orderItems || []).map((item, index) => ({
      key: index + 1,
      itemId: item?._id,
      name: item?.product?.title || "Product unavailable",
      brand: item?.product?.brand || "-",
      count: item?.quantity,
      amount: item?.price,
      color: (
        <div className="col-3">
          <ul
            className="colors ps-0"
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              marginBottom: "10px",

              backgroundColor: item?.color?.title || "#ddd",
            }}
          ></ul>
        </div>
      ),
      size: item?.size?.title || "-",
      available: (
        <Checkbox
          checked={item?.isAvailable !== false}
          onChange={(e) => updateAvailability(item?._id, e.target.checked)}
        >
          {item?.isAvailable === false ? "Not available" : "Available"}
        </Checkbox>
      ),
      availabilityNote:
        item?.isAvailable === false ? (
          <Tag color="red">{item?.availabilityNote || "Currently not available"}</Tag>
        ) : (
          <Tag color="green">Ready</Tag>
        ),
    }));

  return (
    <div>
      <h3 className="mb-4 title">View Order</h3>
      {isError && (
        <div className="alert alert-danger">
          {typeof message === "string" ? message : "Unable to load order"}
        </div>
      )}
      {orderState && (
        <div className="mb-4">
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
      )}
      <div>
        <Table
          columns={columns}
          dataSource={data1}
          loading={isLoading}
          locale={{ emptyText: isLoading ? "Loading order..." : "No products found in this order" }}
        />
      </div>
    </div>
  );
};

export default ViewOrder;
