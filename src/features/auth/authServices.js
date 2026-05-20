import axios from "axios";
import { getAuthConfig } from "../../utils/axiosconfig";
import { base_url } from "../../utils/baseUrl";

// const getTokenFromLocalStorage = localStorage.get("user")
//   ? JSON.parse(localStorage.getItem("user"))
//   : null;

const login = async (user) => {
  const response = await axios.post(`${base_url}user/admin-login`, user);
  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

const withAuth = (options = {}) => ({
  ...options,
  headers: {
    ...getAuthConfig().headers,
    ...(options.headers || {}),
  },
});

// const getOrders = async () => {
//   const response = await axios.get(`${base_url}user/getallorders`);
//   return response.data;
// };

const getOrders = async (data) => {
  const response = await axios.get(`${base_url}user/getallorders`, withAuth(data));

  return response.data;
};
const getOrder = async (id) => {
  const response = await axios.get(
    `${base_url}user/getaOrder/${id}`,

    withAuth()
  );

  return response.data;
};

const updateOrder = async (data) => {
  const response = await axios.put(
    `${base_url}user/updateOrder/${data.id}`,
    { status: data.status, availabilityItems: data.availabilityItems },
    withAuth()
  );

  return response.data;
};

const getMonthlyOrders = async (data) => {
  const response = await axios.get(
    `${base_url}user/getMonthWiseOrderIncome`,

    withAuth(data)
  );

  return response.data;
};

const getYearlyStats = async (data) => {
  const response = await axios.get(
    `${base_url}user/getyearlyorders`,

    withAuth(data)
  );

  return response.data;
};

const authService = {
  login,
  getOrders,
  getOrder,
  getMonthlyOrders,
  getYearlyStats,
  updateOrder,
};

export default authService;
