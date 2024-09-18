import express from 'express';
import https from 'https';

const app = express();
const DEEZER_API_KEY = 'd9391bf815msh735c64ff4d70826p177f85jsn57913074c63a';

// Ruta para buscar álbumes por nombre
app.get('/search/album', (req, res) => {
    const albumName = req.query.name || '';  // Nombre del álbum

    const options = {
        method: 'GET',
        hostname: 'deezerdevs-deezer.p.rapidapi.com',
        port: 443,
        path: `/search/album?q=${encodeURIComponent(albumName)}`,
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
                const data = JSON.parse(body);
                if (data && data.data && data.data.length > 0) {
                    res.json(data);
                } else {
                    res.status(404).send('Álbum no encontrado');
                }
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

// Ruta para obtener información de un género específico
app.get('/genre/:id', (req, res) => {
    const genreId = req.params.id;

    // Respuesta fija para el ID 0
    if (genreId === '0') {
        const fixedResponse = {
            "id": 0,
            "name": "All",
            "picture": "https://api.deezer.com/genre/0/image",
            "picture_small": "https://e-cdns-images.dzcdn.net/images/misc//56x56-000000-80-0-0.jpg",
            "picture_medium": "https://e-cdns-images.dzcdn.net/images/misc//250x250-000000-80-0-0.jpg",
            "picture_big": "https://e-cdns-images.dzcdn.net/images/misc//500x500-000000-80-0-0.jpg",
            "picture_xl": "https://e-cdns-images.dzcdn.net/images/misc//1000x1000-000000-80-0-0.jpg",
            "type": "genre"
        };
        return res.json(fixedResponse);
    }

    const options = {
        method: 'GET',
        hostname: 'api.deezer.com',
        port: 443,
        path: `/genre/${genreId}`,
        headers: {
            'Content-Type': 'application/json'
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
                const response = JSON.parse(body);
                if (response && response.id) {
                    res.json(response);
                } else {
                    res.status(404).send('Género no encontrado');
                }
            } catch (error) {
                console.error('Error al parsear JSON:', error);
                res.status(500).send('Error en la respuesta de Deezer');
            }
        });
    });

    apiReq.on('error', (error) => {
        console.error('Error al obtener la información del género:', error);
        res.status(500).send('Error al obtener la información del género');
    });

    apiReq.end();
});

// Ruta para obtener todos los géneros
app.get('/genres', (req, res) => {
    const options = {
        method: 'GET',
        hostname: 'api.deezer.com',
        port: 443,
        path: '/genre',
        headers: {
            'Content-Type': 'application/json'
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
                const response = JSON.parse(body);

                // Modificar la respuesta para incluir las URLs de imágenes
                const genresWithImages = response.data.map(genre => ({
                    ...genre,
                    picture_small: `/image/${genre.id}-small.jpg`,
                    picture_medium: `/image/${genre.id}-medium.jpg`,
                    picture_big: `/image/${genre.id}-big.jpg`,
                    picture_xl: `/image/${genre.id}-xl.jpg`
                }));

                res.json({ data: genresWithImages });
            } catch (error) {
                console.error('Error al parsear JSON:', error);
                res.status(500).send('Error en la respuesta de Deezer');
            }
        });
    });

    apiReq.on('error', (error) => {
        console.error('Error al obtener la lista de géneros:', error);
        res.status(500).send('Error al obtener la lista de géneros');
    });

    apiReq.end();
});

// Ruta para obtener información de un artista específico
app.get('/artist/:id', (req, res) => {
    const artistId = req.params.id;

    const options = {
        method: 'GET',
        hostname: 'api.deezer.com',
        port: 443,
        path: `/artist/${artistId}`,
        headers: {
            'Content-Type': 'application/json'
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
                const response = JSON.parse(body);
                if (response && response.id) {
                    res.json(response);
                } else {
                    res.status(404).send('Artista no encontrado');
                }
            } catch (error) {
                console.error('Error al parsear JSON:', error);
                res.status(500).send('Error en la respuesta de Deezer');
            }
        });
    });

    apiReq.on('error', (error) => {
        console.error('Error al obtener la información del artista:', error);
        res.status(500).send('Error al obtener la información del artista');
    });

    apiReq.end();
});

export default app;
