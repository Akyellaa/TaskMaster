import { BACKEND_URL } from '@/config';
import axios from 'axios';

// const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const categoryService = {
  getCategories: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`${BACKEND_URL}/api/categories`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        // Handle token invalidation if needed
        localStorage.removeItem('token');
      }
      throw error;
    }
  },

  getCategoryById: async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`${BACKEND_URL}/api/categories/${id}`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
      }
      throw error;
    }
  },

  createCategory: async (categoryData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post(`${BACKEND_URL}/api/categories`, categoryData, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
      }
      throw error;
    }
  },

  updateCategory: async (id, categoryData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.put(`${BACKEND_URL}/api/categories/${id}`, categoryData, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
      }
      throw error;
    }
  },

  deleteCategory: async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.delete(`${BACKEND_URL}/api/categories/${id}`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
      }
      throw error;
    }
  },

  archiveCategory: async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.put(`${BACKEND_URL}/api/categories/${id}/archive`, {}, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
      }
      throw error;
    }
  },

  unarchiveCategory: async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.put(`${BACKEND_URL}/api/categories/${id}/unarchive`, {}, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
      }
      throw error;
    }
  },
}; 