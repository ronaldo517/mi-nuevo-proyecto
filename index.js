import express from 'express';
import https from 'https';
import cors from 'cors';

const app = express();
const DEEZER_API_KEY = 'd9391bf815msh735c64ff4d70826p177f85jsn57913074c63a';

// Middleware para habilitar CORS
app.use(cors());

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
            res.json(JSON.parse(body));  // Enviar la respuesta al cliente
        });
    });

    apiReq.on('error', (error) => {
        console.error('Error al hacer la solicitud:', error);
        res.status(500).send('Error en la búsqueda de Deezer');
    });

    apiReq.end();
});

// Ruta para obtener los detalles del país
app.get('/country', (req, res) => {
    const countryData = {
        "country_iso": "US",
        "country": "Estados Unidos",
        "open": true,
        "pop": "fr",
        "upload_token": "19bcbd054d2213f914596146dba53b98",
        "upload_token_lifetime": 14400,
        "user_token": null,
        "hosts": {
            "stream": "http://e-cdn-proxy-{0}.deezer.com/mobile/1/",
            "images": "http://cdn-images.dzcdn.net/images"
        },
        "ads": {
            "audio": {
                "default": {
                    "start": 1,
                    "interval": 3,
                    "unit": "track"
                }
            },
            "display": {
                "interstitial": {
                    "start": 900,
                    "interval": 900,
                    "unit": "sec"
                }
            }
        },
        "has_podcasts": true,
        "offers": []
    };

    res.json(countryData);  // Respuesta en formato JSON
});

// Ruta para obtener información sobre un género
app.get('/genre/:id', (req, res) => {
    const genreId = req.params.id;  // Obtén el ID del género de los parámetros de la ruta

    const options = {
        method: 'GET',
        hostname: 'deezerdevs-deezer.p.rapidapi.com',
        port: 443,
        path: `/genre/${encodeURIComponent(genreId)}`,  // Usa el ID del género en la ruta
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
            res.json(JSON.parse(body));  // Enviar la respuesta al cliente
        });
    });

    apiReq.on('error', (error) => {
        console.error('Error al hacer la solicitud:', error);
        res.status(500).send('Error al obtener la información del género');
    });

    apiReq.end();
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
