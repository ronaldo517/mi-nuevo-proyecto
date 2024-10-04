// models/Artista.js
import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Artista = sequelize.define('Artista', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    nacionalidad: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    fechaNacimiento: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    seguidores: { // Asegúrate de que este atributo esté definido
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    foto: { // Asegúrate de que este atributo esté definido
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    timestamps: true,
});

export default Artista;