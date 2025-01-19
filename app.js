const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/scrape', async (req, res) => {
  try {
   
    const { data } = await axios.get('https://es.wikipedia.org/wiki/Categor%C3%ADa:M%C3%BAsicos_de_rap');

   
    const $ = cheerio.load(data);

 
    let resultados = [];

   
    $('#mw-pages a').each((index, element) => {
      const enlace = $(element).attr('href');
      const titulo = $(element).text();

    
      axios.get(`https://es.wikipedia.org${enlace}`).then(response => {
        const $page = cheerio.load(response.data);

        const tituloPage = $page('h1').text();
        const imagenes = [];
        $page('img').each((i, el) => {
          imagenes.push($page(el).attr('src'));
        });
        const textos = [];
        $page('p').each((i, el) => {
          textos.push($page(el).text());
        });

       
        resultados.push({
          titulo: tituloPage,
          imagenes,
          textos,
        });

        
        console.log(`Página: ${tituloPage}`);
        console.log('Imagenes:', imagenes);
        console.log('Textos:', textos);
      }).catch(err => console.log('Error al acceder a la página interna:', err));
    });

    res.send('Scraping completado, revisa la consola para ver los resultados.');

  } catch (err) {
    console.error('Error en el scraping:', err);
    res.status(500).send('Hubo un error al hacer scraping.');
  }
});


app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
