/* eslint-disable react-hooks/exhaustive-deps */
import { React, useEffect, useState, useCallback, useMemo } from "react";
import CustomInput from "../components/CustomInput";
import ReactQuill from "react-quill";
import { useLocation, useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { getBrands } from "../features/brand/brandSlice";
import { getCategories } from "../features/pcategory/pcategorySlice";
import { getColors } from "../features/color/colorSlice";
import { getSizes } from "../features/size/sizeSlice";
import { Select } from "antd";
import Dropzone from "react-dropzone";
import { delImg, resetImages, uploadImg } from "../features/upload/uploadSlice";
import {
  createProducts,
  getAProduct,
  resetState,
  updateAProduct,
} from "../features/product/productSlice";

let schema = yup.object().shape({
  title: yup.string().required("Title is Required"),
  description: yup.string().required("Description is Required"),
  price: yup.number().required("Price is Required"),
  wholesellerPrice: yup.number().min(0, "Wholeseller price cannot be negative"),
  retailerPrice: yup.number().min(0, "Retailer price cannot be negative"),
  brand: yup.string().required("Brand is Required"),
  category: yup.string().required("Category is Required"),
  tags: yup
    .array()
    .min(1, "Pick at least one tag")
    .required("Tag is Required"),
  color: yup
    .array()
    .min(1, "Pick at least one color")
    .required("Color is Required"),
  size: yup
    .array()
    .min(1, "Pick at least one size")
    .required("Size is Required"),
  quantity: yup.number().required("Quantity is Required"),
});

const Addproduct = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const getProductId = location.pathname.split("/")[3];
  const navigate = useNavigate();
  const [color, setColor] = useState([]);
  const [size, setSize] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imageColors, setImageColors] = useState({});
  
  const loadData = useCallback(() => {
    dispatch(getBrands());
    dispatch(getCategories());
    dispatch(getColors());
    dispatch(getSizes());
  }, [dispatch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const brandState = useSelector((state) => state.brand.brands);
  const catState = useSelector((state) => state.pCategory.pCategories);
  const colorState = useSelector((state) => state.color.colors);
  const sizeState = useSelector((state) => state.size.sizes);
  const imgState = useSelector((state) => state?.upload?.images);
  const newProduct = useSelector((state) => state.product);
  const {
    isSuccess,
    isError,
    isLoading,
    createdProduct,
    updatedProduct,
    productName,
    productDesc,
    productPrice,
    productWholesellerPrice,
    productRetailerPrice,
    productBrand,
    productCategory,
    productTag,
    productColors,
    productSizes,
    productQuantity,
    productImages,
  } = newProduct;

  useEffect(() => {
    if (getProductId !== undefined) {
      dispatch(getAProduct(getProductId));
    } else {
      dispatch(resetState());
      dispatch(resetImages());
    }
  }, [getProductId]);

  useEffect(() => {
    setExistingImages(productImages || []);
    setImageColors(
      (productImages || []).reduce((colorsByImage, image) => {
        if (image?.public_id && image?.color) {
          colorsByImage[image.public_id] =
            typeof image.color === "object" ? image.color?._id : image.color;
        }
        return colorsByImage;
      }, {})
    );
  }, [productImages]);
  useEffect(() => {
    if (isSuccess && createdProduct) {
      toast.success("Product Added Successfullly!");
    }
    if (isSuccess && updatedProduct) {
      toast.success("Product Updated Successfullly!");
      navigate("/admin/list-product");
    }
    if (isError) {
      toast.error("Something Went Wrong!");
    }
  }, [isSuccess, isError, isLoading]);
  const coloropt = [];
  colorState.forEach((i) => {
    coloropt.push({
      label: (
        <div className="d-flex align-items-center gap-2">
          <span
            style={{
              display: "inline-block",
              width: "20px",
              height: "20px",
              backgroundColor: i.title,
              borderRadius: "50%",
              border: "1px solid #ddd",
            }}
          ></span>
          <span>{i.title}</span>
        </div>
      ),
      value: i._id,
    });
  });
  const sizeopt = [];
  sizeState.forEach((i) => {
    sizeopt.push({
      label: i.title,
      value: i._id,
    });
  });
  const tagOptions = [
    { label: "Featured", value: "featured" },
    { label: "Popular", value: "popular" },
    { label: "Special", value: "special" },
    { label: "New Arrival", value: "new-arrival" },
    { label: "Accessories", value: "accessories" },
    { label: "Spare Parts", value: "spare-parts" },
    { label: "Cover", value: "cover" },
  ];
  const imageColorOptions = colorState.map((colorItem) => ({
    value: colorItem._id,
    label: (
      <div className="d-flex align-items-center gap-2">
        <span
          style={{
            display: "inline-block",
            width: "18px",
            height: "18px",
            borderRadius: "50%",
            backgroundColor: colorItem.title,
            border: "1px solid #ddd",
          }}
        ></span>
        <span>{colorItem.title}</span>
      </div>
    ),
  }));
  const img = useMemo(() => {
    return imgState?.map((i) => ({
      public_id: i.public_id,
      url: i.url,
      color: imageColors[i.public_id] || null,
    })) || [];
  }, [imgState, imageColors]);

  const allProductImages = useMemo(() => {
    return [...existingImages, ...img].map((image) => ({
      ...image,
      color: imageColors[image.public_id] || image.color || null,
    }));
  }, [existingImages, imageColors, img]);

  useEffect(() => {
    formik.setFieldValue("color", color ? color : []);
    formik.setFieldValue("size", size ? size : []);
    formik.setFieldValue("images", allProductImages);
  }, [color, size, allProductImages]);

  useEffect(() => {
    if (getProductId !== undefined) {
      setColor(productColors?.map((item) => item._id) || []);
      setSize(productSizes?.map((item) => item._id) || []);
    }
  }, [getProductId, productColors, productSizes]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: productName || "",
      description: productDesc || "",
      price: productPrice || "",
      wholesellerPrice: productWholesellerPrice || "",
      retailerPrice: productRetailerPrice || "",
      brand: productBrand || "",
      category: productCategory || "",
      tags: Array.isArray(productTag)
        ? productTag
        : productTag
        ? [productTag]
        : [],
      color: productColors || "",
      size: productSizes || "",
      quantity: productQuantity || "",
      images: productImages || [],
    },
    validationSchema: schema,
    onSubmit: (values) => {
      if (getProductId !== undefined) {
        const data = { id: getProductId, productData: values };
        dispatch(updateAProduct(data));
      } else {
        dispatch(createProducts(values));
        formik.resetForm();
        setColor([]);
        setSize([]);
        dispatch(resetImages());
        setTimeout(() => {
          dispatch(resetState());
        }, 3000);
      }
    },
  });
  const handleColors = (e) => {
    setColor(e);
  };
  const handleSizes = (e) => {
    setSize(e);
  };

  const handleDeleteImage = (publicId, isExisting = false) => {
    dispatch(delImg(publicId));
    setImageColors((current) => {
      const next = { ...current };
      delete next[publicId];
      return next;
    });
    if (isExisting) {
      setExistingImages((images) =>
        images.filter((image) => image.public_id !== publicId)
      );
    }
  };

  const handleImageColorChange = (publicId, colorId) => {
    setImageColors((current) => ({
      ...current,
      [publicId]: colorId || null,
    }));
  };

  return (
    <div>
      <h3 className="mb-4 title">
        {getProductId !== undefined ? "Edit" : "Add"} Product
      </h3>
      <div>
        <form
          onSubmit={formik.handleSubmit}
          className="d-flex gap-3 flex-column"
        >
          <CustomInput
            type="text"
            label="Enter Product Title"
            name="title"
            onChng={formik.handleChange("title")}
            onBlr={formik.handleBlur("title")}
            val={formik.values.title}
          />
          <div className="error">
            {formik.touched.title && formik.errors.title}
          </div>
          <div className="">
            <ReactQuill
              theme="snow"
              name="description"
              onChange={formik.handleChange("description")}
              value={formik.values.description}
            />
          </div>
          <div className="error">
            {formik.touched.description && formik.errors.description}
          </div>
          <CustomInput
            type="number"
            label="Enter User Price"
            name="price"
            onChng={formik.handleChange("price")}
            onBlr={formik.handleBlur("price")}
            val={formik.values.price}
          />
          <div className="error">
            {formik.touched.price && formik.errors.price}
          </div>
          <CustomInput
            type="number"
            label="Enter Wholeseller Price"
            name="wholesellerPrice"
            onChng={formik.handleChange("wholesellerPrice")}
            onBlr={formik.handleBlur("wholesellerPrice")}
            val={formik.values.wholesellerPrice}
          />
          <div className="error">
            {formik.touched.wholesellerPrice && formik.errors.wholesellerPrice}
          </div>
          <CustomInput
            type="number"
            label="Enter Retailer Price"
            name="retailerPrice"
            onChng={formik.handleChange("retailerPrice")}
            onBlr={formik.handleBlur("retailerPrice")}
            val={formik.values.retailerPrice}
          />
          <div className="error">
            {formik.touched.retailerPrice && formik.errors.retailerPrice}
          </div>
          <select
            name="brand"
            onChange={formik.handleChange("brand")}
            onBlur={formik.handleBlur("brand")}
            value={formik.values.brand}
            className="form-control py-3 mb-3"
            id=""
          >
            <option value="">Select Brand</option>
            {brandState.map((i, j) => {
              return (
                <option key={j} value={i.title}>
                  {i.title}
                </option>
              );
            })}
          </select>
          <div className="error">
            {formik.touched.brand && formik.errors.brand}
          </div>
          <select
            name="category"
            onChange={formik.handleChange("category")}
            onBlur={formik.handleBlur("category")}
            value={formik.values.category}
            className="form-control py-3 mb-3"
            id=""
          >
            <option value="">Select Category</option>
            {catState.map((i, j) => {
              return (
                <option key={j} value={i.title}>
                  {i.title}
                </option>
              );
            })}
          </select>
          <div className="error">
            {formik.touched.category && formik.errors.category}
          </div>
          <Select
            mode="multiple"
            allowClear
            className="w-100"
            placeholder="Select tags"
            value={formik.values.tags}
            onChange={(value) => formik.setFieldValue("tags", value)}
            onBlur={() => formik.setFieldTouched("tags", true)}
            options={tagOptions}
          />
          <div className="error">
            {formik.touched.tags && formik.errors.tags}
          </div>

          <Select
            mode="multiple"
            allowClear
            className="w-100"
            placeholder="Select colors"
            value={color}
            onChange={(i) => handleColors(i)}
            options={coloropt}
          />
          <div className="error">
            {formik.touched.color && formik.errors.color}
          </div>
          <Select
            mode="multiple"
            allowClear
            className="w-100"
            placeholder="Select sizes"
            value={size}
            onChange={(i) => handleSizes(i)}
            options={sizeopt}
          />
          <div className="error">
            {formik.touched.size && formik.errors.size}
          </div>
          <CustomInput
            type="number"
            label="Enter Product Quantity"
            name="quantity"
            onChng={formik.handleChange("quantity")}
            onBlr={formik.handleBlur("quantity")}
            val={formik.values.quantity}
          />
          <div className="error">
            {formik.touched.quantity && formik.errors.quantity}
          </div>
          <div className="bg-white border-1 p-5 text-center">
            <Dropzone
              multiple
              maxFiles={10}
              onDrop={(acceptedFiles) => dispatch(uploadImg(acceptedFiles))}
            >
              {({ getRootProps, getInputProps }) => (
                <section>
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p>
                      Drag 'n' drop product images here, or click to select multiple files
                    </p>
                    <small className="text-muted">
                      You can upload up to 10 images per product.
                    </small>
                  </div>
                </section>
              )}
            </Dropzone>
          </div>
          <div className="showimages d-flex flex-wrap gap-3">
            {existingImages?.map((i, j) => {
              return (
                <div className=" position-relative" key={j}>
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(i.public_id, true)}
                    className="btn-close position-absolute"
                    style={{ top: "10px", right: "10px" }}
                  ></button>
                  <img src={i.url} alt="" width={200} height={200} />
                  <Select
                    className="w-100 mt-2"
                    allowClear
                    placeholder="Link image to color"
                    value={imageColors[i.public_id] || ""}
                    onChange={(value) =>
                      handleImageColorChange(i.public_id, value)
                    }
                    options={imageColorOptions}
                  />
                </div>
              );
            })}
            {imgState?.map((i, j) => {
              return (
                <div className=" position-relative" key={j}>
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(i.public_id)}
                    className="btn-close position-absolute"
                    style={{ top: "10px", right: "10px" }}
                  ></button>
                  <img src={i.url} alt="" width={200} height={200} />
                  <Select
                    className="w-100 mt-2"
                    allowClear
                    placeholder="Link image to color"
                    value={imageColors[i.public_id] || ""}
                    onChange={(value) =>
                      handleImageColorChange(i.public_id, value)
                    }
                    options={imageColorOptions}
                  />
                </div>
              );
            })}
          </div>
          <button
            className="btn btn-success border-0 rounded-3 my-5"
            type="submit"
          >
            {getProductId !== undefined ? "Edit" : "Add"} Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default Addproduct;
