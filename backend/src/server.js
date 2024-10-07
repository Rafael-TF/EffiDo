require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Añade esta línea
const authRoutes = require('../../backend/src/routes/authRoutes');
const taskRoutes = require('../../backend/src/routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Configuración de CORS
app.use(cors({
  origin: 'http://localhost:3000', // Asegúrate de que este sea el origen de tu frontend
  credentials: true
}));

app.use(express.json());

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({ message: 'El servidor está funcionando correctamente' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));

// console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
// console.log('EMAIL_PORT:', process.env.EMAIL_PORT);
// console.log('EMAIL_USER:', process.env.EMAIL_USER);
// No imprimas EMAIL_PASS por razones de seguridad
// console.log('EMAIL_FROM:', process.env.EMAIL_FROM);

// Servir archivos estáticos
app.use('/avatars', express.static(path.join(__dirname, '..', 'public', 'avatars')));