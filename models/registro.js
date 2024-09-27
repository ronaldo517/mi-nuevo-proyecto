import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Registro = sequelize.define('registro', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre1: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nombre2: {
        type: DataTypes.STRING,
    },
    apellido1: {
        type: DataTypes.STRING,
        allowNull: false
    },
    apellido2: {
        type: DataTypes.STRING,
    },
    correo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    contraseña: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'registro', // Asegúrate de que el nombre de la tabla sea singular
    timestamps: true
});

export default Registro;
