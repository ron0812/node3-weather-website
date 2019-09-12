const path = require('path');
const express = require('express');
const hbs = require('hbs');

const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();
const port = process.env.PORT || 3000;

// Define Paths for Express Config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup Handlebars Engine and Views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));



// Home Page
app.get('', (req, res) => {
    res.render('index', {                   // render() allows to render views/handlebars instead of send()
        title: 'Weather',
        name: 'RON'
    });
});

// Help Page
app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        helpText: 'I am here to help.',
        name: 'RON'
    });
})

// About Page
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'RON'
    });
})

// Weather Page
app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({                          // 'return' is used to stop the function execution
            error: 'You must provide an address.'  // else block can also be used but the former is a
        })                                         // common pattern while using express
    }

    geocode(req.query.address, (err, { longitude, latitude, location } = {}) => {
        if (err) {
            return res.send({
                error: err
            })
        }

        forecast(longitude, latitude, (err, data) => {
            if (err) {
                return res.send({
                    error: err
                })
            }

            // console.log(location);
            // console.log(data);
            res.send({
                forecast: data,
                location: location,
                address: req.query.address
            })
        })
    })
})

// Help Wild card routes
app.get('/help/*', (req, res) => {
    res.render('pageNotFound', {
        title: 'Error 404',
        name: 'RON',
        msg: 'Help Article Not Found.'
    })
})

// Wild card (404) routes
app.get('*', (req, res) => {
    res.render('pageNotFound', {
        title: 'Error 404',
        name: 'RON',
        msg: 'Page Not Found.'
    })
})

app.listen(port, () => {
    console.log('Server is up on port '+ port +'.');
})