import axios from "axios";
import { base_url } from "../../utils/baseUrl";
import { getAuthConfig } from "../../utils/axiosconfig";

const getUsers = async () => {
  const response = await axios.get(`${base_url}user/all-users`, getAuthConfig());

  return response.data;
};

const updateUser = async (user) => {
  const response = await axios.put(
    `${base_url}user/admin-update-user/${user.id}`,
    user.data,
    getAuthConfig()
  );

  return response.data;
};

const blockUser = async (id) => {
  const response = await axios.put(`${base_url}user/block-user/${id}`, {}, getAuthConfig());
  return response.data;
};

const unblockUser = async (id) => {
  const response = await axios.put(`${base_url}user/unblock-user/${id}`, {}, getAuthConfig());
  return response.data;
};

const customerService = {
  getUsers,
  updateUser,
  blockUser,
  unblockUser,
};

export default customerService;
