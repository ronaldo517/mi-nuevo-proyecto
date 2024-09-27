import express from 'express';
import https from 'https';
import cors from 'cors';
import sequelize from './db.js';  // Asegúrate de incluir la extensión .js
import Album from './models/album.js';
import Buscar from './models/buscar.js';
import Playlis from './models/playlis.js';
import Artista from './models/artista.js';  // Asegúrate de que el archivo existe
import Genero from './models/genero.js';    // Asegúrate de que el archivo existe
import registro from './models/registro.js';    // Asegúrate de que el archivo existe
import Iniciar from './models/iniciar.js';    // Asegúrate de que el archivo existe
import bcrypt from 'bcrypt';

const app = express();
const DEEZER_API_KEY = 'd9391bf815msh735c64ff4d70826p177f85jsn57913074c63a';

// Middleware para habilitar CORS
app.use(cors());

// Middleware para parsear JSON
app.use(express.json());

// Endpoint para registro
app.post('/registro', async (req, res) => {
    const { nombre1, nombre2, apellido1, apellido2, correo, contraseña } = req.body;

    try {
        
    
// Aquí puedes hacer la lógica para guardar el registro en la base de datos
        
  
// Por ejemplo, guardando en una tabla de usuarios (asegúrate de tenerla creada)
        
       
// await Usuario.create({ nombre1, nombre2, apellido1, apellido2, correo, contraseña });

        // Respuesta exitosa
        res.status(201).send('Usuario registrado con éxito');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al registrar el usuario');
    }
});

// Sincronizar modelos con la base de datos
sequelize.authenticate()
    .then(() => {
        console.log('Conexión a la base de datos establecida con éxito.');

        // Sincronizar los modelos con la base de datos
        return sequelize.sync({ force: false });  // Cambia a 'true' si quieres que sobrescriba las tablas
    })
    .then(() => {
        console.log('Modelos sincronizados correctamente.');
    })
    .catch(err => {
        console.error('No se pudo conectar a la base de datos:', err);
    });

// Ruta para buscar canciones
app.get('/search', (req, res) => {
    const query = req.query.q || 'eminem';  // Parámetro de búsqueda

    const options = {
        method: 'GET',
        hostname: 'deezerdevs-deezer.p.rapidapi.com',
        port: 443,
        path: `/search?q=${encodeURIComponent(query)}`,
        headers: {
            'x-rapidapi-key': DEEZER_API_KEY,
            'x-rapidapi-host': 'deezerdevs-deezer.p.rapidapi.com'
        }
    };

    const apiReq = https.request(options, (apiRes) => {
        const chunks = [];

        apiRes.on('data', (chunk) => {
            chunks.push(chunk);
        });

        apiRes.on('end', () => {
            const body = Buffer.concat(chunks).toString();
            try {
                res.json(JSON.parse(body));  // Enviar la respuesta al cliente
            } catch (error) {
                console.error('Error al parsear JSON:', error);
                res.status(500).send('Error en la respuesta de Deezer');
            }
        });
    });

    apiReq.on('error', (error) => {
        console.error('Error al hacer la solicitud:', error);
        res.status(500).send('Error en la búsqueda de Deezer');
    });

    apiReq.end();
});

// Función para obtener detalles del álbum desde Deezer
const fetchAlbumDetails = (albumId) => {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'GET',
            hostname: 'api.deezer.com',
            port: 443,
            path: `/album/${albumId}`,
        };

        const req = https.request(options, (res) => {
            const chunks = [];

            res.on('data', (chunk) => {
                chunks.push(chunk);
            });

            res.on('end', () => {
                const body = Buffer.concat(chunks).toString();
                try {
                    const jsonResponse = JSON.parse(body);
                    resolve(jsonResponse);
                } catch (error) {
                    reject(`Error parsing JSON: ${error.message}. Response: ${body}`);
                }
            });
        });

        req.on('error', (e) => {
            reject(`Problem with request: ${e.message}`);
        });

        req.end();
    });
};

// Endpoint para obtener detalles del álbum
app.get('/album/:id', async (req, res) => {
    const albumId = req.params.id;
    try {
        const albumData = await fetchAlbumDetails(albumId);
        res.json(albumData);
    } catch (error) {
        console.error('Error al buscar el álbum:', error);
        res.status(500).json({ error: 'Error al buscar el álbum.' });
    }
});

// Ruta para buscar álbumes por nombre
const fetchAlbum = (albumName) => {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'GET',
            hostname: 'api.deezer.com',
            port: 443,
            path: `/search/album?q=${encodeURIComponent(albumName)}`,
        };

        const req = https.request(options, (res) => {
            const chunks = [];

            res.on('data', (chunk) => {
                chunks.push(chunk);
            });

            res.on('end', () => {
                const body = Buffer.concat(chunks).toString();
                try {
                    const jsonResponse = JSON.parse(body);
                    resolve(jsonResponse);
                } catch (error) {
                    reject(`Error parsing JSON: ${error.message}. Response: ${body}`);
                }
            });
        });

        req.on('error', (e) => {
            reject(`Problem with request: ${e.message}`);
        });

        req.end();
    });
};

// Ruta para buscar álbumes
app.get('/search/album', async (req, res) => {
    const albumName = req.query.name;
    if (!albumName) {
        return res.status(400).json({ error: 'Nombre del álbum es requerido.' });
    }

    try {
        const albumData = await fetchAlbum(albumName);
        console.log(albumData); // Para depuración
        res.json(albumData);
    } catch (error) {
        console.error('Error al buscar álbumes:', error);
        res.status(500).json({ error: 'Error al buscar álbumes.' });
    }
});

// Ruta para obtener información de un artista
app.get('/artist/:id', async (req, res) => {
    const artistId = req.params.id;

    const options = {
        method: 'GET',
        hostname: 'deezerdevs-deezer.p.rapidapi.com',
        port: 443,
        path: `/artist/${artistId}`,
        headers: {
            'x-rapidapi-key': DEEZER_API_KEY,
            'x-rapidapi-host': 'deezerdevs-deezer.p.rapidapi.com'
        }
    };

    try {
        const response = await new Promise((resolve, reject) => {
            https.request(options, (apiRes) => {
                const chunks = [];

                apiRes.on('data', (chunk) => {
                    chunks.push(chunk);
                });

                apiRes.on('end', () => {
                    const body = Buffer.concat(chunks).toString();
                    try {
                        const json = JSON.parse(body);
                        console.log(json); // Aquí se imprime la respuesta del artista
                        resolve(json);
                    } catch (error) {
                        reject(`Error parsing JSON: ${error.message}. Response: ${body}`);
                    }
                });
            }).on('error', (e) => {
                reject(`Problem with request: ${e.message}`);
            }).end();
        });

        res.json(response);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la información del artista.' });
    }
});

// Ruta para obtener información de un género
app.get('/genre/:id', async (req, res) => {
    const genreId = req.params.id;

    try {
        const response = await fetch(`https://api.deezer.com/genre/${genreId}`);
        const genreData = await response.json();

        if (genreData) {
            res.json(genreData);
        } else {
            res.status(404).json({ error: 'Género no encontrado.' });
        }
    } catch (error) {
        console.error('Error fetching genre:', error);
        res.status(500).json({ error: 'Error al obtener información del género.' });
    }
});









// para la base de datos de MySQL 
app.post('/api/registro', async (req, res) => {
    const { nombre1, nombre2, apellido1, apellido2, correo, contraseña } = req.body;

    // Validaciones en el backend
    if (!nombre1 || !nombre2 || !apellido1 || !apellido2 || !correo || !contraseña) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        const nuevoUsuario = await registro.create({
            nombre1,
            nombre2,
            apellido1,
            apellido2,
            correo,
            contraseña
        });
        res.status(201).json({ message: 'Usuario registrado con éxito', data: nuevoUsuario });
    } catch (error) {
        console.error('Error al registrar el usuario:', error); // Añadido para depuración
        if (error.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ error: 'El correo ya está registrado' });
        } else {
            res.status(500).json({ error: 'Error al registrar el usuario' });
        }
    }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//este es el de iniciar sesion
// Ruta para iniciar sesión
// Ruta para agregar datos a la tabla 'iniciars'
// Ruta para iniciar sesión
// Ruta para iniciar sesión
app.post('/api/iniciar', async (req, res) => {
    const { usuario, contraseña } = req.body;

    // Verificar que se hayan proporcionado los campos requeridos
    if (!usuario || !contraseña) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    try {
        // Buscar el usuario en la base de datos
        const user = await registro.findOne({
            where: {
                nombre1: usuario,
                contraseña: contraseña // Verificar la contraseña tal como está almacenada
            }
        });

        if (!user) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        // Si las credenciales son correctas
        res.json({ message: 'Inicio de sesión exitoso' });
        // Aquí puedes redirigir al usuario a otra página o hacer otras acciones necesarias

    } catch (error) {
        console.error('Error al realizar la consulta:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).send('Ruta no encontrada');
});
// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
