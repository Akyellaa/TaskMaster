import { BACKEND_URL } from '@/config';
import axios from 'axios';
// import { BACKEND_URL } from '../config/config';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const getNotifications = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.get(`${BACKEND_URL}/api/notifications`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

export const markNotificationAsRead = async (id) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.post(`${BACKEND_URL}/api/notifications/${id}/read`, {}, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    console.error('Error marking notification as read:', error);
    throw error;
  }
}; 