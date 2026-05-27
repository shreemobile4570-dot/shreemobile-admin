/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import CustomInput from "../components/CustomInput";
import {
  createCompatibility,
  getACompatibility,
  resetState,
  updateACompatibility,
} from "../features/compatibility/compatibilitySlice";

const categoryOptions = ["display", "battery", "charging board", "camera", "back panel"];

const schema = yup.object().shape({
  category: yup.string().required("Category is required"),
  mainModel: yup.string().required("Main model is required"),
  compatibleModelsText: yup.string().required("Add at least one compatible model"),
  notes: yup.string(),
});

const AddCompatibility = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const compatibilityId = location.pathname.split("/")[3];
  const compatibilityState = useSelector((state) => state.compatibility);
  const {
    isSuccess,
    isError,
    isLoading,
    createdCompatibility,
    updatedCompatibility,
    selectedCompatibility,
  } = compatibilityState;

  useEffect(() => {
    if (compatibilityId !== undefined) {
      dispatch(getACompatibility(compatibilityId));
    } else {
      dispatch(resetState());
    }
  }, [compatibilityId]);

  useEffect(() => {
    if (isSuccess && createdCompatibility) {
      toast.success("Compatibility Added Successfully!");
    }
    if (isSuccess && updatedCompatibility) {
      toast.success("Compatibility Updated Successfully!");
      navigate("/admin/list-compatibility");
    }
    if (isError) {
      toast.error("Something Went Wrong!");
    }
  }, [isSuccess, isError, isLoading]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      category: selectedCompatibility?.category || "display",
      mainModel: selectedCompatibility?.mainModel || "",
      compatibleModelsText: selectedCompatibility?.compatibleModels?.join("\n") || "",
      notes: selectedCompatibility?.notes || "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      const compatibilityData = {
        category: values.category,
        mainModel: values.mainModel,
        compatibleModels: values.compatibleModelsText
          .split(/[\n,]+/)
          .map((model) => model.trim())
          .filter(Boolean),
        notes: values.notes,
      };

      if (compatibilityId !== undefined) {
        dispatch(updateACompatibility({ id: compatibilityId, compatibilityData }));
      } else {
        dispatch(createCompatibility(compatibilityData));
        formik.resetForm();
        setTimeout(() => dispatch(resetState()), 300);
      }
    },
  });

  return (
    <div>
      <h3 className="mb-4 title">
        {compatibilityId !== undefined ? "Edit" : "Add"} Compatibility
      </h3>
      <form onSubmit={formik.handleSubmit} className="admin-compatibility-form">
        <div className="form-floating mt-3">
          <input
            className="form-control"
            list="compatibility-categories"
            id="compatibility-category"
            placeholder="Part Category"
            value={formik.values.category}
            onChange={formik.handleChange("category")}
            onBlur={formik.handleBlur("category")}
          />
          <label htmlFor="compatibility-category">Part Category</label>
          <datalist id="compatibility-categories">
            {categoryOptions.map((category) => (
              <option key={category} value={category} />
            ))}
          </datalist>
        </div>
        <div className="error">{formik.touched.category && formik.errors.category}</div>

        <CustomInput
          type="text"
          label="Main Model / Part Model"
          i_id="mainModel"
          onChng={formik.handleChange("mainModel")}
          onBlr={formik.handleBlur("mainModel")}
          val={formik.values.mainModel}
        />
        <div className="error">{formik.touched.mainModel && formik.errors.mainModel}</div>

        <div className="form-floating mt-3">
          <textarea
            className="form-control admin-compatibility-textarea"
            id="compatibleModelsText"
            placeholder="Compatible Models"
            value={formik.values.compatibleModelsText}
            onChange={formik.handleChange("compatibleModelsText")}
            onBlur={formik.handleBlur("compatibleModelsText")}
          />
          <label htmlFor="compatibleModelsText">Compatible Models</label>
        </div>
        <p className="desc mt-2 mb-0">Add one model per line or separate models with commas.</p>
        <div className="error">
          {formik.touched.compatibleModelsText && formik.errors.compatibleModelsText}
        </div>

        <div className="form-floating mt-3">
          <textarea
            className="form-control"
            id="notes"
            placeholder="Notes"
            value={formik.values.notes}
            onChange={formik.handleChange("notes")}
            onBlur={formik.handleBlur("notes")}
          />
          <label htmlFor="notes">Notes</label>
        </div>

        <button className="btn btn-success border-0 rounded-3 my-5" type="submit">
          {compatibilityId !== undefined ? "Edit" : "Add"} Compatibility
        </button>
      </form>
    </div>
  );
};

export default AddCompatibility;
