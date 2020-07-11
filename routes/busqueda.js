var express = require('express');

var app = express();

var Categoria = require('../models/categoria');
var SubCategoria = require('../models/subcategoria');
var Producto = require('../models/producto');
var Usuario = require('../models/usuario');

// ===============================================
// Busqueda por coleccion
// ===============================================
app.get('/coleccion/:tabla/:busqueda', (req, resp, next) => {

    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;
        case 'categoria':
            promesa = buscarCategorias(busqueda, regex);
            break;
        case 'subcategoria':
            promesa = buscarSubCategorias(busqueda, regex);
            break;
        case 'producto':
            promesa = buscarProductos(busqueda, regex);
            break;
        default:
            resp.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda sólo son: usuarios, categorías, subcategorías y productos',
                error: { message: 'Tipo tabla/coleccion no válido' }
            });
    }

    promesa.then(data => {
        resp.status(200).json({
            ok: true,
            [tabla]: data
        });
    });



});

// ===============================================
// Busqueda general
// ===============================================
app.get('/todo/:busqueda', (req, resp, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    Promise.all([buscarHospitales(busqueda, regex), buscarMedicos(busqueda, regex), buscarUsuarios(busqueda, regex)])
        .then(respuestas => {
            resp.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            });
        });

});

function buscarCategorias(busqueda, regex) {

    return new Promise((resolve, reject) => {
        Categoria.find({ nombre: regex })
            .exec((err, categorias) => {

                if (err) {
                    reject('Error al cargar categorías', err);
                } else {
                    resolve(categorias);
                }
            });
    });


}

function buscarSubCategorias(busqueda, regex) {

    return new Promise((resolve, reject) => {
        SubCategoria.find({ nombre: regex })
            .populate('idCategoria', 'nombre')
            .exec((err, subcategorias) => {

                if (err) {
                    reject('Error al cargar sub categorías', err);
                } else {
                    resolve(subcategorias);
                }
            });
    });
}

function buscarUsuarios(busqueda, regex) {

    return new Promise((resolve, reject) => {
        Usuario.find({}, 'nombre email role img google')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }
            });
    });
}

function buscarProductos(busqueda, regex) {

    return new Promise((resolve, reject) => {
        Producto.find({ nombre: regex })
            .populate('idSubCategoria', 'nombre idCategoria')
            .exec((err, productos) => {
                if (err) {
                    reject('Error al cargar productos', err);
                } else {
                    resolve(productos);
                }
            });
    });
}

module.exports = app;