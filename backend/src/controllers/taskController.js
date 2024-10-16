import Task from "../models/Task.js";
import User from "../models/User.js";

async function updateUserStats(userId) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tasks = await Task.find({ user: userId });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(
      (task) => task.status === "completada"
    ).length;

    const taskCompletionRate =
      totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    const weeklyProductivity = Array(7)
      .fill()
      .map((_, i) => {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        const endOfDay = new Date(date.setHours(23, 59, 59, 999));

        const dayTasks = tasks.filter((task) => {
          const taskDate = new Date(task.createdAt);
          return taskDate >= startOfDay && taskDate <= endOfDay;
        });

        const completedDayTasks = dayTasks.filter(
          (task) => task.status === "completada"
        );

        const score = dayTasks.length + completedDayTasks.length;

        return {
          day: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"][date.getDay()],
          score: score,
        };
      })
      .reverse();

    const productivityScore =
      Math.round((completedTasks / totalTasks) * 100) || 0;

    let streakDays = 0;
    for (let i = 0; i < weeklyProductivity.length; i++) {
      if (weeklyProductivity[i].score > 0) {
        streakDays++;
      } else if (i === 0) {
        continue;
      } else {
        break;
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          totalTasks,
          completedTasks,
          taskCompletionRate,
          weeklyProductivity,
          productivityScore,
          streakDays,
        },
      },
      { new: true }
    );

    return updatedUser;
  } catch (error) {
    throw error;
  }
}

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las tareas", error });
  }
};

export const createTask = async (req, res) => {
  try {
    const newTask = new Task({
      ...req.body,
      user: req.user.id,
    });
    const savedTask = await newTask.save();
    await updateUserStats(req.user.id);
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(400).json({ message: "Error al crear la tarea", error });
  }
};

export const getTask = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority, status, dueDate } = req.body;

    if (!id) {
      return res.status(400).json({ message: "ID de tarea no proporcionado" });
    }

    if (!title || !description || !priority || !status || !dueDate) {
      return res
        .status(400)
        .json({ message: "Todos los campos son requeridos" });
    }

    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { title, description, priority, status, dueDate },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    await updateUserStats(req.user.id);
    res.json(updatedTask);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar la tarea", error: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }
    await updateUserStats(req.user.id);
    res.json({ message: "Tarea eliminada con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la tarea", error });
  }
};

export const getAllTasksPrioritized = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }
    const tasks = await Task.find({ user: req.user.id });
    const prioritizedTasks = prioritizeTasks(tasks);
    res.json(prioritizedTasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

function prioritizeTasks(tasks) {
  // Implementa tu lógica de priorización aquí
  // Por ahora, simplemente devolvemos las tareas sin cambios
  return tasks;
}