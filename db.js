import { Sequelize } from 'sequelize';

// Configuración de Sequelize con nuevo nombre de la base de datos
const sequelize = new Sequelize('ronalmusic', 'root', '123456789', {
    host: 'localhost',
    dialect: 'mysql'
});

// Verificar la conexión
sequelize.authenticate()
    .then(() => {
        console.log('Conexión a la base de datos establecida con éxito.');
    })
    .catch(err => {
        console.error('No se pudo conectar a la base de datos:', err);
    });

export default sequelize;
