var express = require('express');
var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();
var Categoria = require('../models/categoria');

// ===============================================
// Obtener todos las categorías
// ===============================================
app.get('/', (req, resp, next) => {

    /*Si quiere buscar campos en especifico
    Categoria.find({}, 'nombre descripcion')*/
    Categoria.find({}, null, { sort: { nombre: 1 } })
        .exec(
            (err, categorias) => {
                if (err) {
                    return resp.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando categorías',
                        errors: err
                    });
                }
                Categoria.countDocuments({}, (err, conteo) => {
                    if (err) {
                        return resp.status(500).json({
                            ok: false,
                            mensaje: 'Error en el conteo de categorías',
                            errors: err
                        });
                    }
                    resp.status(200).json({
                        ok: true,
                        categorias: categorias,
                        mensaje: 'Get de categorías',
                        total: conteo
                    });
                });

            });
});

// ===============================================
// Crear nueva Categoría
// ===============================================
app.post('/', [mdAutenticacion.verificarToken, mdAutenticacion.verificarADMIN_ROLE], (req, resp) => {

    var body = req.body;

    var categoria = new Categoria({
        nombre: (body.nombre).toUpperCase(),
        descripcion: (body.descripcion).toUpperCase()
    });

    categoria.save((err, categoriaGuardada) => {
        if (err) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'Error al crear categoría',
                errors: err
            });
        }
        resp.status(201).json({
            ok: true,
            categoria: categoriaGuardada
        });
    });
});
// ===============================================
// Actualizar categoría
// ===============================================
app.put('/:id', [mdAutenticacion.verificarToken, mdAutenticacion.verificarADMIN_ROLE], (req, resp) => {
    var id = req.params.id;
    var body = req.body;

    Categoria.findById(id, (err, categoria) => {

        if (err) {
            return resp.status(500).json({
                ok: false,
                mensaje: 'Error al buscar categoría',
                errors: err
            });
        }

        if (!categoria) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'La categoría con el id ' + id + 'no existe',
                errors: { message: 'No existe una categoría con ese ID' }
            });

        }

        categoria.nombre = (body.nombre).toUpperCase();
        categoria.descripcion = (body.descripcion).toUpperCase();

        categoria.save((err, categoriaGuardada) => {
            if (err) {
                return resp.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar categoría',
                    errors: err
                });
            }

            resp.status(200).json({
                ok: true,
                categoria: categoriaGuardada
            });
        });
    });
});

// ===============================================
// Borrar una categoria por id
// ===============================================
app.delete('/:id', [mdAutenticacion.verificarToken, mdAutenticacion.verificarADMIN_ROLE], (req, resp) => {


    var id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {

        if (err) {
            return resp.status(500).json({
                ok: false,
                mensaje: 'Error al borrar categoría',
                errors: err
            });
        }
        if (!categoriaBorrada) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'No existe una categoría con ese ID',
                errors: { message: 'No existe una categoría con ese ID' }
            });
        }
        resp.status(200).json({
            ok: true,
            categoria: categoriaBorrada
        });
    });
});
module.exports = app;