// models/Search.js
import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Search = sequelize.define('Search', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    query: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    artistName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    albumName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    genreName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    previewUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    timestamps: true,  // Añadirá createdAt y updatedAt automáticamente
});

export default Search;
