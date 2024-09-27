// models/artista.js
import { DataTypes } from 'sequelize';
import sequelize from '../db.js';  // Asegúrate de incluir la extensión .js

const Artista = sequelize.define('Artista', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nacionalidad: {
        type: DataTypes.STRING,
        allowNull: true
    },
    fechaNacimiento: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'Artistas', // Nombre de la tabla en la base de datos
    timestamps: false // Cambia a true si deseas agregar columnas de tiempo (createdAt, updatedAt)
});

export default Artista;
