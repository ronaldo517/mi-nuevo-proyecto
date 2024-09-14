const mysql = require("mysql2/promise");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

// Conexión a la base de datos
const db = mysql.createPool({
    host: "localhost",
    user: "root",
    database: "mydb",
    password: "123456789",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Configuración de Express
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Test de conexión a la base de datos
async function testConnection() {
    try {
        const connection = await db.getConnection();
        console.log('Conexión exitosa a la base de datos');
        connection.release();  // Libera la conexión cuando ya no sea necesaria
    } catch (error) {
        console.error('Error al conectar con la base de datos:', error);
        process.exit(1); // Detener la ejecución si no hay conexión
    }
}

testConnection();

// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
