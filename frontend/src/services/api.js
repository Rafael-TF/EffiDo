import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

console.log('Entorno:', process.env.NODE_ENV);
console.log('API_URL:', API_URL);

const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 403) {
        throw new Error('Por favor, verifique su email antes de acceder a la cuenta');
      } else if (error.response.status === 401) {
        throw new Error('Credenciales inválidas');
      } else {
        throw new Error(error.response.data.message || 'Error en el inicio de sesión');
      }
    } else if (error.request) {
      throw new Error('No se recibió respuesta del servidor');
    } else {
      throw new Error('Error al configurar la solicitud');
    }
  }
};

export const register = (userData) => axios.post(`${API_URL}/auth/register`, userData);
export const logout = () => {
  localStorage.removeItem('token');
};
export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await axios.post(`${API_URL}/auth/reset-password/${token}`, { password: newPassword });
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await axiosInstance.post('/users/change-password', { currentPassword, newPassword });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Error al cambiar la contraseña');
    } else if (error.request) {
      throw new Error('No se recibió respuesta del servidor');
    } else {
      throw new Error('Error al configurar la solicitud');
    }
  }
};

export const getAllTasks = async () => {
  try {
    const response = await axiosInstance.get('/tasks');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createTask = async (task) => {
  try {
    const response = await axiosInstance.post('/tasks', task);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateTask = async (taskId, updatedTask) => {
  try {
    if (!taskId) {
      throw new Error('ID de tarea no válido');
    }
    const response = await axiosInstance.put(`/tasks/${taskId}`, updatedTask);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteTask = async (taskId) => {
  try {
    const response = await axiosInstance.delete(`/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserProfile = async () => {
  try {
    const response = await axiosInstance.get('/users/profile');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUserProfile = (userData) => axiosInstance.put('/users/profile', userData);

let isVerifying = false;

export const verifyEmail = async (token) => {
  if (isVerifying) {
    return { message: 'Ya se está procesando una solicitud de verificación' };
  }

  isVerifying = true;

  try {
    const encodedToken = encodeURIComponent(token);
    const url = `${API_URL}/auth/verify-email/${encodedToken}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Error en la verificación del email');
    } else if (error.request) {
      throw new Error('No se recibió respuesta del servidor');
    } else {
      throw new Error('Error al configurar la solicitud');
    }
  } finally {
    isVerifying = false;
  }
};

export const deleteAccount = async () => {
  try {
    const response = await axiosInstance.delete('/users/delete-account');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const uploadAvatar = async (file) => {
  try {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await axiosInstance.post('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.avatarUrl;
  } catch (error) {
    throw error;
  }
};

export const getUserStats = async () => {
  try {
    const response = await axiosInstance.get('/users/stats');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserAchievements = async () => {
  try {
    const response = await axiosInstance.get('/users/achievements');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const testConnection = async () => {
  try {
    const response = await axios.get(`${API_URL}/test`);
    console.log('Respuesta de prueba:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error en la prueba de conexión:', error);
    throw error;
  }
};