import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

console.log('API_URL:', API_URL); // Para debugging


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
    // console.log('Intentando iniciar sesión con:', credentials.email);
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    // console.log('Respuesta del servidor (login):', response.data);
    
    // Guardar el token en localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    // console.error('Error completo de login:', error);
    if (error.response) {
      // console.error('Respuesta de error del servidor (login):', error.response.data);
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

// Funciones de autenticación
export const register = (userData) => axios.post(`${API_URL}/api/auth/register`, userData);
export const logout = () => {
  localStorage.removeItem('token');
  // Puedes agregar aquí cualquier otra lógica necesaria para el logout
};
export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
    return response.data;
  } catch (error) {
    // console.error('Error en forgotPassword:', error);
    throw error;
  }
};
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await axios.post(`${API_URL}/auth/reset-password/${token}`, { password: newPassword });
    // console.log('Respuesta del servidor (resetPassword):', response.data);
    return response.data;
  } catch (error) {
    // console.error('Error completo en resetPassword:', error);
    throw error;
  }
};
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await axiosInstance.post('/users/change-password', { currentPassword, newPassword });
    // console.log('Respuesta del servidor (changePassword):', response.data);
    return response.data;
  } catch (error) {
    // console.error('Error al cambiar la contraseña:', error);
    if (error.response) {
      throw new Error(error.response.data.message || 'Error al cambiar la contraseña');
    } else if (error.request) {
      throw new Error('No se recibió respuesta del servidor');
    } else {
      throw new Error('Error al configurar la solicitud');
    }
  }
};

// Funciones de tareas
export const getAllTasks = async () => {
  try {
    // console.log('Obteniendo todas las tareas...');
    const token = localStorage.getItem('token');
    // console.log('Token usado para la solicitud:', token);
    const response = await axiosInstance.get('/tasks', {
      headers: { Authorization: `Bearer ${token}` }
    });
    // console.log('Respuesta de getAllTasks:', response.data);
    return response.data;
  } catch (error) {
    // console.error('Error en getAllTasks:', error);
    if (error.response) {
      // console.error('Respuesta de error del servidor:', error.response.data);
      // console.error('Estado de la respuesta:', error.response.status);
    }
    throw error;
  }
};

export const createTask = async (task) => {
  try {
    const response = await axiosInstance.post('/tasks', task);
    return response.data;
  } catch (error) {
    // console.error('Error al crear la tarea:', error);
    throw error;
  }
};

export const updateTask = async (taskId, updatedTask) => {
  try {
    if (!taskId) {
      throw new Error('ID de tarea no válido');
    }
    // console.log('Enviando actualización de tarea:', { taskId, updatedTask });
    const response = await axiosInstance.put(`/tasks/${taskId}`, updatedTask);
    // console.log('Respuesta del servidor:', response.data);
    return response.data;
  } catch (error) {
    // console.error('Error en updateTask:', error);
    throw error;
  }
};

export const deleteTask = async (taskId) => {
  try {
    const response = await axiosInstance.delete(`/tasks/${taskId}`);
    // console.log('Respuesta del servidor al eliminar:', response.data);
    return response.data;
  } catch (error) {
    // console.error('Error en deleteTask:', error);
    throw error;
  }
};

// Funciones de usuario
export const getUserProfile = async () => {
  try {
    const response = await axiosInstance.get('/users/profile');
    return response.data;
  } catch (error) {
    // console.error('Error al obtener el perfil de usuario:', error);
    throw error;
  }
};

export const updateUserProfile = (userData) => axiosInstance.put('/users/profile', userData);

let isVerifying = false;

export const verifyEmail = async (token) => {
  if (isVerifying) {
    // console.log('Ya se está procesando una solicitud de verificación');
    return { message: 'Ya se está procesando una solicitud de verificación' };
  }

  isVerifying = true;

  try {
    // console.log('Token recibido en el frontend:', token);
    const encodedToken = encodeURIComponent(token);
    // console.log('Token codificado:', encodedToken);
    const url = `${API_URL}/auth/verify-email/${encodedToken}`;
    // console.log('URL de verificación:', url);
    
    const response = await axios.get(url);
    // console.log('Respuesta del servidor:', response.data);
    return response.data;
  } catch (error) {
    // console.error('Error completo:', error);
    if (error.response) {
      // console.error('Respuesta de error del servidor:', error.response.data);
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
    // console.error('Error al eliminar la cuenta:', error);
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
    // console.log('Respuesta del servidor al subir avatar:', response.data);
    return response.data.avatarUrl;
  } catch (error) {
    // console.error('Error al subir el avatar:', error);
    throw error;
  }
};

// Funciones de estadísticas y logros
export const getUserStats = async () => {
  try {
    const response = await axiosInstance.get('/users/stats');
    // console.log('Respuesta completa de getUserStats:', response.data);
    return response.data;
  } catch (error) {
    // console.error('Error al obtener estadísticas del usuario:', error);
    throw error;
  }
};

export const getUserAchievements = async () => {
  try {
    const response = await axiosInstance.get('/users/achievements');
    return response.data;
  } catch (error) {
    // console.error('Error al obtener logros del usuario:', error);
    throw error;
  }
};
