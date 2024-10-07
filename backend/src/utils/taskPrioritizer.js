function calculatePriorityScore(task) {
    let score = 0;
  
    // Factor de fecha de vencimiento
    const daysUntilDue = getDaysUntilDue(task.dueDate);
    if (daysUntilDue <= 1) {
      score += 50;
    } else if (daysUntilDue <= 3) {
      score += 30;
    } else if (daysUntilDue <= 7) {
      score += 10;
    }
  
    // Factor de importancia
    score += task.importance * 5;
  
    // Factor de tiempo estimado
    if (task.estimatedTime <= 30) { // 30 minutos o menos
      score += 10;
    } else if (task.estimatedTime <= 60) { // 1 hora o menos
      score += 5;
    }
  
    // Factor de prioridad asignada por el usuario
    score += task.priority * 3;
  
    return score;
  }
  
  function getDaysUntilDue(dueDate) {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = Math.abs(due - now);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  
  function prioritizeTasks(tasks) {
    return tasks.map(task => ({
      ...task.toObject(),
      priorityScore: calculatePriorityScore(task)
    })).sort((a, b) => b.priorityScore - a.priorityScore);
  }
  
  module.exports = { prioritizeTasks };
  