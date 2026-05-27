/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import { Table } from "antd";
import { AiFillDelete } from "react-icons/ai";
import { BiEdit } from "react-icons/bi";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CustomModal from "../components/CustomModal";
import {
  deleteACompatibility,
  getCompatibility,
  resetState,
} from "../features/compatibility/compatibilitySlice";

const CompatibilityList = () => {
  const [open, setOpen] = useState(false);
  const [compatibilityId, setCompatibilityId] = useState("");
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const compatibility = useSelector((state) => state.compatibility.compatibility);

  useEffect(() => {
    dispatch(resetState());
    dispatch(getCompatibility());
  }, []);

  const filteredCompatibility = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return compatibility;

    return compatibility.filter((item) => {
      const haystack = [
        item.category,
        item.mainModel,
        ...(item.compatibleModels || []),
        item.notes,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(term);
    });
  }, [compatibility, search]);

  const showModal = (id) => {
    setOpen(true);
    setCompatibilityId(id);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const deleteCompatibility = (id) => {
    dispatch(deleteACompatibility(id));
    setOpen(false);
    setTimeout(() => dispatch(getCompatibility()), 100);
  };

  const columns = [
    { title: "SNo", dataIndex: "key" },
    {
      title: "Category",
      dataIndex: "category",
      sorter: (a, b) => a.category.localeCompare(b.category),
    },
    {
      title: "Main Model",
      dataIndex: "mainModel",
      sorter: (a, b) => a.mainModel.localeCompare(b.mainModel),
    },
    { title: "Compatible With", dataIndex: "compatibleModels" },
    { title: "Action", dataIndex: "action" },
  ];

  const data = filteredCompatibility.map((item, index) => ({
    key: index + 1,
    category: item.category,
    mainModel: item.mainModel,
    compatibleModels: (item.compatibleModels || []).join(", "),
    action: (
      <>
        <Link to={`/admin/compatibility/${item._id}`} className="fs-3 text-danger">
          <BiEdit />
        </Link>
        <button
          className="ms-3 fs-3 text-danger bg-transparent border-0"
          onClick={() => showModal(item._id)}
        >
          <AiFillDelete />
        </button>
      </>
    ),
  }));

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <span>Shared parts</span>
          <h3 className="mb-0 title">Compatibility</h3>
          <p>Search by main model or any compatible model.</p>
        </div>
        <Link className="btn btn-success border-0 rounded-3" to="/admin/compatibility">
          Add Compatibility
        </Link>
      </div>

      <div className="admin-checklist-toolbar">
        <div>
          <strong>Compatibility Search</strong>
          <p className="desc mb-0">Find a record by category, main model, or sub model.</p>
        </div>
        <input
          className="form-control"
          placeholder="Search model..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <div className="admin-desktop-table">
        <Table columns={columns} dataSource={data} />
      </div>

      <div className="admin-customer-cards">
        {filteredCompatibility.map((item) => (
          <div className="admin-customer-list-card" key={item._id}>
            <div className="admin-customer-list-top">
              <div>
                <span className="admin-order-label">{item.category}</span>
                <h4>{item.mainModel}</h4>
                <p>{(item.compatibleModels || []).join(", ")}</p>
              </div>
            </div>
            {item.notes && <p className="admin-customer-address">{item.notes}</p>}
            <div className="admin-customer-actions">
              <Link className="btn btn-outline-danger" to={`/admin/compatibility/${item._id}`}>
                Edit
              </Link>
              <button className="btn btn-danger" onClick={() => showModal(item._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => deleteCompatibility(compatibilityId)}
        title="Are you sure you want to delete this compatibility?"
      />
    </div>
  );
};

export default CompatibilityList;
