const Task = require("../models/Task");
const User = require("../models/User");

async function updateUserStats(userId) {
  try {
    // ...

    const tasks = await Task.find({ user: userId });
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(
      (task) => task.status === "completada"
    ).length;

    // Calcular los datos de las tareas para la estadística
    const taskData = tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {});

    // Calcular la productividad semanal
    const weeklyProductivity = Array(7)
      .fill()
      .map((_, i) => {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        // Clonar la fecha para evitar modificarla
        const startOfDay = new Date(new Date(date).setHours(0, 0, 0, 0));
        const endOfDay = new Date(new Date(date).setHours(23, 59, 59, 999));

        const dayTasks = tasks.filter((task) => {
          const taskDate = new Date(task.createdAt);
          return taskDate >= startOfDay && taskDate <= endOfDay;
        });

        const completedDayTasks = dayTasks.filter(
          (task) => task.status === "completada"
        );

        const score = completedDayTasks.length + dayTasks.length * 0.5; // Revisa si esta fórmula es la adecuada

        return {
          day: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"][date.getDay()],
          score: score,
        };
      })
      .reverse();

    // Calcular la puntuación de productividad
    const productivityScore =
      Math.round((completedTasks / totalTasks) * 100) || 0;

    // Calcular racha de días
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

    // Actualizar las estadísticas del usuario
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          totalTasks,
          completedTasks,
          taskData,
          weeklyProductivity,
          productivityScore,
          streakDays,
        },
      },
      { new: true }
    );

    return updatedUser;
  } catch (error) {
    // console.error("Error al actualizar las estadísticas del usuario:", error);
    throw error;
  }
}

async function updateUserStats(userId) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tasks = await Task.find({ user: userId });
    // console.log(
    //   `Total de tareas encontradas para el usuario ${userId}: ${tasks.length}`
    // );

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(
      (task) => task.status === "completada"
    ).length;
    // console.log(`Tareas completadas: ${completedTasks}`);

    const taskCompletionRate =
      totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    // Calcular la productividad semanal
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

        // Calculamos el score como la suma de tareas creadas y completadas
        const score = dayTasks.length + completedDayTasks.length;
        // console.log(
        //   `Día ${date.toISOString().split("T")[0]}: ${
        //     dayTasks.length
        //   } tareas creadas, ${
        //     completedDayTasks.length
        //   } completadas, score: ${score}`
        // );

        return {
          day: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"][date.getDay()],
          score: score,
        };
      })
      .reverse();

    // console.log(
    //   "Productividad semanal calculada:",
    //   JSON.stringify(weeklyProductivity)
    // );

    const productivityScore =
      Math.round((completedTasks / totalTasks) * 100) || 0;

    // Calcular racha de días
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

    // Actualizar las estadísticas del usuario
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

    // console.log("Estadísticas actualizadas:", JSON.stringify(updatedUser));
    return updatedUser;
  } catch (error) {
    // console.error("Error al actualizar las estadísticas del usuario:", error);
    throw error;
  }
}

// Obtener todas las tareas
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (error) {
    // console.error("Error al obtener las tareas:", error);
    res.status(500).json({ message: "Error al obtener las tareas", error });
  }
};

// Crear una nueva tarea
exports.createTask = async (req, res) => {
  try {
    // console.log(`Creando nueva tarea para el usuario: ${req.user.id}`);
    const newTask = new Task({
      ...req.body,
      user: req.user.id,
    });
    const savedTask = await newTask.save();
    // console.log(`Tarea creada: ${JSON.stringify(savedTask)}`);
    await updateUserStats(req.user.id);
    res.status(201).json(savedTask);
  } catch (error) {
    // console.error("Error al crear la tarea:", error);
    res.status(400).json({ message: "Error al crear la tarea", error });
  }
};

// Obtener una tarea específica
exports.getTask = async (req, res) => {
  try {
    // console.log(
    //   `Obteniendo tarea: ${req.params.id} para el usuario: ${req.user.id}`
    // );
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }
    // const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) {
      // console.log("Tarea no encontrada");
      return res.status(404).json({ message: "Tarea no encontrada" });
    }
    // console.log(`Tarea encontrada: ${JSON.stringify(task)}`);
    res.json(task);
  } catch (error) {
    // console.error("Error al obtener una tarea específica:", error);
    res.status(500).json({ message: error.message });
  }
};

// Actualizar una tarea
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority, status, dueDate } = req.body;

    // console.log(`Actualizando tarea: ${id} para el usuario: ${req.user.id}`);
    // console.log("Datos recibidos para actualización:", { id, ...req.body });

    if (!id) {
      return res.status(400).json({ message: "ID de tarea no proporcionado" });
    }

    // Validación de campos
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
      // console.log("Tarea no encontrada para actualizar");
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    // console.log(`Tarea actualizada: ${JSON.stringify(updatedTask)}`);
    await updateUserStats(req.user.id);
    res.json(updatedTask);
  } catch (error) {
    // console.error("Error al actualizar la tarea:", error);
    res
      .status(500)
      .json({ message: "Error al actualizar la tarea", error: error.message });
  }
};

// Eliminar una tarea
exports.deleteTask = async (req, res) => {
  try {
    // console.log(
    //   `Eliminando tarea: ${req.params.id} para el usuario: ${req.user.id}`
    // );
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!task) {
      // console.log("Tarea no encontrada para eliminar");
      return res.status(404).json({ message: "Tarea no encontrada" });
    }
    // console.log(`Tarea eliminada: ${JSON.stringify(task)}`);
    await updateUserStats(req.user.id);
    res.json({ message: "Tarea eliminada con éxito" });
  } catch (error) {
    // console.error("Error al eliminar la tarea:", error);
    res.status(500).json({ message: "Error al eliminar la tarea", error });
  }
};

// Obtener todas las tareas con prioridad
exports.getAllTasksPrioritized = async (req, res) => {
  try {
    // console.log(
    //   `Obteniendo tareas priorizadas para el usuario: ${req.user?.id}`
    // );
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }
    const tasks = await Task.find({ user: req.user.id });
    // console.log(`Tareas encontradas: ${tasks.length}`);
    const prioritizedTasks = prioritizeTasks(tasks);
    // console.log(`Tareas priorizadas: ${prioritizedTasks.length}`);
    res.json(prioritizedTasks);
  } catch (error) {
    // console.error("Error al obtener tareas priorizadas:", error);
    res.status(500).json({ message: error.message });
  }
};

// Función auxiliar para priorizar tareas (debes implementar esta lógica)
function prioritizeTasks(tasks) {
  // Implementa tu lógica de priorización aquí
  // Por ahora, simplemente devolvemos las tareas sin cambios
  return tasks;
}

module.exports = {
  getAllTasks: exports.getAllTasks,
  createTask: exports.createTask,
  getTask: exports.getTask,
  updateTask: exports.updateTask,
  deleteTask: exports.deleteTask,
  getAllTasksPrioritized: exports.getAllTasksPrioritized,
};
