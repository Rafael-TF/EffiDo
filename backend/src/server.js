require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Configuración de CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'https://effido.onrender.com' : 'http://localhost:3000',
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
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));