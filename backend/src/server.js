import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://effido.onrender.com' 
    : 'http://localhost:3000',
  credentials: true
}));


app.use(express.json());

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({ message: 'El servidor está funcionando correctamente' });
});

// Servir archivos estáticos de avatares
app.use('/avatars', express.static(path.join(__dirname, '..', 'public', 'avatars')));

// Configuración para servir la aplicación React en producción
if (process.env.NODE_ENV === 'production') {
  // Servir archivos estáticos desde la carpeta build de React
  app.use(express.static(path.join(__dirname, '../../frontend/build')));
  
  // Manejar cualquier solicitud que no sea a las rutas API
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
  console.log(`Entorno: ${process.env.NODE_ENV}`);
});