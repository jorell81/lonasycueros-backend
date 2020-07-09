var express = require('express');

var app = express();

app.get('/', (req, resp, next) => {
    resp.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente1111'
    });
});

module.exports = app;