const express = require('express');
const app = express();
const port = 3000;

// Middleware
app.use(express.json());

// Conectar a la base de datos
const db = require('./config/db');

// Definir rutas
app.get('/', (req, res) => {
  res.send('Hola!');
});
// config/db.js
const mysql = require('mysql2');

// Crear conexión
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'mydb',
  password: '123456789'
});

// Conectar
connection.connect((err) => {
  if (err) {
    console.error('Error de conexión: ' + err.stack);
    return;
  }
  console.log('Conectado a la base de datos.');
});

module.exports = connection;

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
