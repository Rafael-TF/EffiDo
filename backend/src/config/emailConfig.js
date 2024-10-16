import nodemailer from 'nodemailer';

console.log('Configurando transporter con:', {
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS ? 'Configurado' : 'No configurado'
});

const transporter = nodemailer.createTransport({
  host: 'smtp-mail.outlook.com',
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    ciphers: 'SSLv3'
  },
  debug: true,
  logger: console
});

// Verificar la conexión
transporter.verify(function(error, success) {
  if (error) {
    console.log('Error al verificar la conexión del transporter:', error);
  } else {
    console.log('Servidor listo para enviar emails');
  }
});

export default transporter;