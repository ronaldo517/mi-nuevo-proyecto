import { DataTypes } from 'sequelize';
import sequelize from '../db.js'; // Asegúrate de tener la conexión a la base de datos
import Registro from './registro.js'; // Importa el modelo de Registro

const Iniciar = sequelize.define('Iniciar', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    registroId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Registro, // Relación con el modelo Registro
            key: 'id',      // Clave primaria del modelo Registro
        },
    },
    contrasena: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW, // Valor por defecto para la fecha de creación
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW, // Valor por defecto para la fecha de actualización
    },
}, {
    timestamps: true, // Esto manejará createdAt y updatedAt automáticamente
});

// Sincroniza la relación entre los modelos
Registro.hasMany(Iniciar, { foreignKey: 'registroId' });
Iniciar.belongsTo(Registro, { foreignKey: 'registroId' });

export default Iniciar; // Exportación por defecto