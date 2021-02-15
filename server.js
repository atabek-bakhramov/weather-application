import express from 'express';
import exphbs from 'express-handlebars';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
dotenv.config();

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
    res.render('index', { layout: 'main' });
});

app.post('/weather', async (req, res) => {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${req.body.cityName}&appid=${process.env.API_KEY}&units=metric`);
        const dataJson = await response.json();
        res.status(200);
        res.render('index', {
            temperature: `In ${req.body.cityName} ${dataJson.main.temp} °C`,
            description: `${dataJson.weather[0].main}`,
            windSpeed: `Wind Speed: ${dataJson.wind.speed} m/s`
        })
    } catch(error) {
        res.status(404);
        res.render('404', { layout: 'error' });
    }
})

app.get('*', (req, res) => {
    res.render('404', { layout: 'error' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => { console.log(`Server started on port ${PORT}`) });
