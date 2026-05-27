import axios from "axios";
import { base_url } from "../../utils/baseUrl";
import { config } from "../../utils/axiosconfig";

const getCompatibility = async (params = {}) => {
  const response = await axios.get(`${base_url}compatibility/`, { params });
  return response.data;
};

const createCompatibility = async (data) => {
  const response = await axios.post(`${base_url}compatibility/`, data, config);
  return response.data;
};

const getACompatibility = async (id) => {
  const response = await axios.get(`${base_url}compatibility/${id}`, config);
  return response.data;
};

const updateCompatibility = async (data) => {
  const response = await axios.put(
    `${base_url}compatibility/${data.id}`,
    data.compatibilityData,
    config
  );
  return response.data;
};

const deleteCompatibility = async (id) => {
  const response = await axios.delete(`${base_url}compatibility/${id}`, config);
  return response.data;
};

const compatibilityService = {
  getCompatibility,
  createCompatibility,
  getACompatibility,
  updateCompatibility,
  deleteCompatibility,
};

export default compatibilityService;
