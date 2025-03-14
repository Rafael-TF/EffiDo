import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['pendiente', 'en progreso', 'completada'], default: 'pendiente' },
  priority: { type: String, enum: ['baja', 'media', 'alta'], default: 'media' },
  dueDate: { type: Date },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

export default Task;