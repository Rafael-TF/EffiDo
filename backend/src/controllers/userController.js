const User = require('../models/User');
const Task = require('../models/Task');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

exports.getUserProfile = async (req, res) => {
  // console.log('Solicitud recibida para obtener perfil de usuario');
  // console.log('Usuario en la solicitud:', req.user);
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error al obtener el perfil de usuario:', error);
    res.status(500).json({ message: 'Error al obtener el perfil de usuario' });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (username) user.username = username;
    if (email) user.email = email;

    await user.save();

    res.json({ message: 'Perfil actualizado exitosamente', user: { id: user._id, username: user.username, email: user.email } });
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el perfil de usuario' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Se requieren la contraseña actual y la nueva' });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'La contraseña actual es incorrecta' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Contraseña cambiada exitosamente' });
  } catch (error) {
    // console.error('Error al cambiar la contraseña:', error);
    res.status(500).json({ message: 'Error al cambiar la contraseña' });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    // Eliminar todas las tareas del usuario
    await Task.deleteMany({ user: req.user.id });

    // Eliminar el usuario
    await User.findByIdAndDelete(req.user.id);

    res.json({ message: 'Cuenta eliminada exitosamente' });
  } catch (error) {
    // console.error('Error al eliminar la cuenta:', error);
    res.status(500).json({ message: 'Error al eliminar la cuenta', error: error.message });
  }
};

exports.uploadAvatar = async (req, res) => {
  try {
    // console.log('Iniciando carga de avatar');
    // console.log('Archivo recibido:', req.file);
    
    if (!req.file) {
      // console.log('No se ha subido ningún archivo');
      return res.status(400).json({ message: 'No se ha subido ningún archivo' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      // console.log('Usuario no encontrado');
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Si el usuario ya tiene un avatar, elimina el archivo anterior
    if (user.avatarUrl) {
      const oldAvatarPath = path.join(__dirname, '..', '..', 'public', 'avatars', path.basename(user.avatarUrl));
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
        // console.log('Avatar anterior eliminado');
      }
    }

    // Guarda la nueva URL del avatar
    user.avatarUrl = `/avatars/${req.file.filename}`;
    await user.save();
    // console.log('Avatar actualizado en la base de datos');

    res.json({ avatarUrl: user.avatarUrl });
  } catch (error) {
    // console.error('Error al subir el avatar:', error);
    res.status(500).json({ message: 'Error al subir el avatar', error: error.message });
  }
};

exports.getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const tasks = await Task.find({ user: userId });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'completada').length;
    const productivityScore = calculateProductivityScore(tasks);
    const taskCompletionRate = totalTasks > 0 ? Number((completedTasks / totalTasks * 100).toFixed(2)) : 0;
    const streakDays = calculateStreakDays(tasks);
    const weeklyProductivity = calculateWeeklyProductivity(tasks);

    const stats = {
      totalTasks,
      completedTasks,
      productivityScore,
      taskCompletionRate,
      streakDays,
      weeklyProductivity
    };

    res.json(stats);
  } catch (error) {
    // console.error('Error al obtener estadísticas del usuario:', error);
    res.status(500).json({ message: 'Error al obtener estadísticas del usuario' });
  }
};

exports.getUserAchievements = async (req, res) => {
  try {
    const userId = req.user.id;
    const tasks = await Task.find({ user: userId });
    const achievements = calculateAchievements(tasks);

    res.json(achievements);
  } catch (error) {
    // console.error('Error al obtener logros del usuario:', error);
    res.status(500).json({ message: 'Error al obtener logros del usuario' });
  }
};

// Funciones auxiliares para cálculos
function calculateProductivityScore(tasks) {
  // Implementa la lógica real para calcular la puntuación de productividad
  const completedTasks = tasks.filter(task => task.status === 'completada');
  const totalDifficulty = completedTasks.reduce((sum, task) => sum + (task.difficulty || 1), 0);
  return Math.min(100, Math.floor((totalDifficulty / tasks.length) * 100)) || 0;
}

function calculateStreakDays(tasks) {
  // Implementa la lógica real para calcular los días consecutivos de actividad
  let streak = 0;
  let maxStreak = 0;
  let lastDate = null;

  const sortedTasks = tasks
    .filter(task => task.status === 'completada')
    .sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt));

  sortedTasks.forEach(task => {
    const currentDate = new Date(task.completedAt).toDateString();
    if (currentDate !== lastDate) {
      if (lastDate === null || new Date(currentDate) - new Date(lastDate) === 86400000) {
        streak++;
      } else {
        maxStreak = Math.max(maxStreak, streak);
        streak = 1;
      }
      lastDate = currentDate;
    }
  });

  return Math.max(maxStreak, streak);
}

function calculateWeeklyProductivity(tasks) {
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const weeklyScores = Array(7).fill(0);
  const today = new Date();
  const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  tasks.forEach(task => {
    if (task.status === 'completada' && new Date(task.completedAt) >= oneWeekAgo) {
      const dayIndex = new Date(task.completedAt).getDay();
      weeklyScores[dayIndex] += task.difficulty || 1;
    }
  });

  return days.map((day, index) => ({
    day,
    score: weeklyScores[index]
  }));
}

function calculateAchievements(tasks) {
  const achievements = [];
  const completedTasks = tasks.filter(task => task.status === 'completada');

  if (completedTasks.length >= 1) {
    achievements.push({ id: 1, name: 'Primera tarea completada', icon: '🏆' });
  }

  if (calculateStreakDays(tasks) >= 7) {
    achievements.push({ id: 2, name: '7 días seguidos activo', icon: '🔥' });
  }

  if (completedTasks.length >= 100) {
    achievements.push({ id: 3, name: '100 tareas completadas', icon: '💯' });
  }

  return achievements;
}