const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

app.get('/', async (req, res) => {
  try {
    const { data } = await axios.get('https://es.wikipedia.org/wiki/Categor%C3%ADa:M%C3%BAsicos_de_rap');
    const $ = cheerio.load(data);

    const usuarios = [];

    $('#mw-pages a').each((index, element) => {
      const enlace = $(element).attr('href');
      const titulo = $(element).text();
      usuarios.push({ titulo, enlace });
    });

    res.send(usuarios); // Muestra los datos en el navegador
  } catch (error) {
    console.error('Error al hacer scraping:', error);
    res.status(500).send('Error en el servidor');
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
