import express from 'express';
import https from 'https';
import cors from 'cors';

const app = express();
const DEEZER_API_KEY = 'd9391bf815msh735c64ff4d70826p177f85jsn57913074c63a';

// Middleware para habilitar CORS
app.use(cors());

// Middleware para parsear JSON
app.use(express.json());

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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ID del álbum que deseas buscar
const albumId = '302127'; // Cambia esto por el ID del álbum que quieres buscar

const options = {
    method: 'GET',
    hostname: 'deezerdevs-deezer.p.rapidapi.com',
    port: 443,
    path: `/album/${albumId}`, // Ruta completa con el ID del álbum
    headers: {
        'x-rapidapi-key': 'd9391bf815msh735c64ff4d70826p177f85jsn57913074c63a',
        'x-rapidapi-host': 'deezerdevs-deezer.p.rapidapi.com'
    }
};

// Función para buscar álbumes
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
        res.status(500).json({ error: 'Error al buscar el álbum.' });
    }
});

///////////////////////////////////////////////////////////////////////////////////////////////////

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});