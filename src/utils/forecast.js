const request = require('request');

const forecast = (lat, lon, callback) => {
    const url = `https://api.darksky.net/forecast/d0f9c55b272ef1679f6d01682e23bc99/${lon},${lat}?units=si`

    request({ url, json: true }, (error, {body}) => {
        if (error) {
            callback('Unable to connect to weather services!', undefined)
        } else if (body.error) {
            callback('Unable to find location. Try another search.', undefined)
        } else {
            callback(undefined, `${body.daily.data[0].summary} It is currently ${body.currently.temperature} degrees out. There is a ${body.currently.precipProbability}% chance of rain. Today's High and Low Temperatures are ${body.daily.data[0].temperatureHigh} and ${body.daily.data[0].temperatureLow} respectively.`)
        }
    })
}

module.exports = forecast;

