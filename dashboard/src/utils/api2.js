import axios from "axios";

const API_URL = "http://localhost:5000/api";
const api = axios.create({
  baseURL: API_URL,
});

// Reuse the token management from your existing API file
const getToken = () => localStorage.getItem("adminToken");

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Error handling helper
const handleResponse = async (apiCall) => {
  try {
    const response = await apiCall;
    return { success: true, data: response.data };
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || "An unexpected error occurred",
    };
  }
};

// Driver management APIs
export const registerDriver = async (driverData) => {
  return handleResponse(api.post("/admin/drivers/register", driverData));
};

export const getAllDrivers = async (params) => {
  try {
    const response = await api.get("/admin/drivers", { params });
    return {
      success: true,
      count: response.data.count,
      data: response.data.data,
    };
  } catch (error) {
    console.error("Error in getAllDrivers:", error);
    return {
      success: false,
      error: error.response?.data?.message || "An unexpected error occurred",
      data: [],
    };
  }
};

export const getDriverById = async (driverId) => {
  try {
    const response = await api.get(`/admin/drivers/${driverId}`);
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error("Error in getDriverById:", error);
    return {
      success: false,
      error: error.response?.data?.message || "An unexpected error occurred",
    };
  }
};

export const approveDriver = async (driverId) => {
  try {
    const response = await api.patch(`/admin/drivers/${driverId}/approve`);
    return {
      success: true,
      data: response.data.data,
      credentials: response.data.credentials, // This will contain username and temporary password
    };
  } catch (error) {
    console.error("Error in approveDriver:", error);
    return {
      success: false,
      error: error.response?.data?.message || "An unexpected error occurred",
    };
  }
};

export const updateDriver = async (driverId, driverData) => {
  try {
    const response = await api.patch(`/admin/drivers/${driverId}`, driverData);
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error("Error in updateDriver:", error);
    return {
      success: false,
      error: error.response?.data?.message || "An unexpected error occurred",
    };
  }
};

export const deleteDriver = async (driverId) => {
  try {
    const response = await api.delete(`/admin/drivers/${driverId}`);
    return {
      success: true,
      message: response.data.message,
    };
  } catch (error) {
    console.error("Error in deleteDriver:", error);
    return {
      success: false,
      error: error.response?.data?.message || "An unexpected error occurred",
    };
  }
};

// Export for use in components
// Branch management APIs
export const createBranch = async (branchData) => {
  return handleResponse(api.post("/admin/branches", branchData));
};

export const getAllBranches = async () => {
  try {
    const response = await api.get("/admin/branches");
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error("Error in getAllBranches:", error);
    return {
      success: false,
      error: error.response?.data?.message || "An unexpected error occurred",
      data: [],
    };
  }
};

// Get branches with credentials (for admin use)
export const getAllBranchesWithCredentials = async () => {
  try {
    const response = await api.get(
      "/admin/branches/admin/branches-with-credentials"
    );
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error("Error in getAllBranchesWithCredentials:", error);
    return {
      success: false,
      error: error.response?.data?.message || "An unexpected error occurred",
      data: [],
    };
  }
};

// Change branch password
export const changeBranchPassword = async (branchId, newPassword) => {
  try {
    const response = await api.put(
      `/admin/branches/${branchId}/change-password`,
      {
        newPassword,
      }
    );
    return {
      success: true,
      message: response.data.message,
    };
  } catch (error) {
    console.error("Error in changeBranchPassword:", error);
    return {
      success: false,
      error: error.response?.data?.message || "An unexpected error occurred",
    };
  }
};
export const getBranchById = async (branchId) => {
  try {
    const response = await api.get(`/admin/branches/${branchId}`);
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error("Error in getBranchById:", error);
    return {
      success: false,
      error: error.response?.data?.message || "An unexpected error occurred",
    };
  }
};

export const updateBranch = async (branchId, branchData) => {
  try {
    const response = await api.put(`/admin/branches/${branchId}`, branchData);
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error("Error in updateBranch:", error);
    return {
      success: false,
      error: error.response?.data?.message || "An unexpected error occurred",
    };
  }
};

export const deleteBranch = async (branchId) => {
  try {
    const response = await api.delete(`/admin/branches/${branchId}`);
    return {
      success: true,
      message: response.data.message,
    };
  } catch (error) {
    console.error("Error in deleteBranch:", error);
    return {
      success: false,
      error: error.response?.data?.message || "An unexpected error occurred",
    };
  }
};