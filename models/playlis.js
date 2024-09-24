// models/Playlist.js
import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Playlist = sequelize.define('Playlist', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

export default Playlist;
