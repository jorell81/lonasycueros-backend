var express = require('express');
var moment = require('moment-timezone');
var app = express();

app.get('/', (req, resp, next) => {
    var fecha = moment(new Date()).tz('America/Bogota').format();

    resp.status(200).json({
        ok: true,
        mensaje: fecha
    });
});









module.exports = app;