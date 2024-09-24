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

// Función para buscar álbumes por nombre
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

///////////////////////////////////////////////////////////////////////////////////////////////////

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

//////////////////////////////////////////////////////////////////////////////////////////////////

// Endpoint para buscar canciones
app.get('/search', async (req, res) => {
    const query = req.query.q;
    
    try {
        // Buscar canciones usando la API de Deezer
        const response = await fetch(`https://api.deezer.com/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        
        if (data.data && data.data.length > 0) {
            const tracks = await Promise.all(data.data.map(async (item) => {
                if (item.type === 'track') {
                    // Obtener el género del artista
                    const artistResponse = await fetch(`https://api.deezer.com/artist/${item.artist.id}`);
                    const artistData = await artistResponse.json();
                    
                    // Preparar la respuesta
                    return {
                        title: item.title,
                        artist: {
                            name: item.artist.name,
                            id: item.artist.id,
                            genre: artistData.genres.data.length > 0 ? artistData.genres.data[0].name : 'Desconocido'
                        },
                        preview: item.preview
                    };
                }
            }));
            
            // Filtrar solo los resultados de tipo track
            const filteredTracks = tracks.filter(track => track);
            res.json({ data: filteredTracks });
        } else {
            res.json({ data: [] });
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Error al buscar canciones.' });
    }
});

// Endpoint para obtener información de un género
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

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});