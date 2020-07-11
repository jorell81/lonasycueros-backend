var express = require('express');
var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();
var Categoria = require('../models/categoria');
var SubCategoria = require('../models/subcategoria');

// ===============================================
// Obtener todos las sub categorías
// ===============================================
app.get('/', (req, resp) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);
    /*Si quiere buscar campos en especifico
    Categoria.find({}, 'nombre descripcion')*/
    SubCategoria.find({}, null, { sort: { nombre: 1 } })
        .populate('idCategoria', 'nombre')
        .exec(
            (err, subcategorias) => {
                if (err) {
                    return resp.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando sub categorías',
                        errors: err
                    });
                }
                SubCategoria.countDocuments({}, (err, conteo) => {
                    if (err) {
                        return resp.status(500).json({
                            ok: false,
                            mensaje: 'Error en el conteo de sub categorías',
                            errors: err
                        });
                    }
                    resp.status(200).json({
                        ok: true,
                        subcategorias: subcategorias,
                        mensaje: 'Get de Sub Categorías',
                        total: conteo
                    });
                });

            });
});

// ===============================================
// Obtener las sub categorías por Id categoria
// ===============================================
app.get('/:id', [mdAutenticacion.verificarToken, mdAutenticacion.verificarADMIN_ROLE], (req, resp) => {
    var id = req.params.id;
    SubCategoria.find({ idCategoria: id }, null, { sort: { nombre: 1 } })
        .exec(
            (err, subcategorias) => {
                if (err) {
                    return resp.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando sub categorías',
                        errors: err
                    });
                }
                SubCategoria.countDocuments({}, (err, conteo) => {
                    if (err) {
                        return resp.status(500).json({
                            ok: false,
                            mensaje: 'Error en el conteo de sub categorías',
                            errors: err
                        });
                    }
                    resp.status(200).json({
                        ok: true,
                        subcategorias: subcategorias,
                        mensaje: 'Get de Sub Categorías',
                        total: conteo
                    });
                });

            });
});

// ===============================================
// Crear nueva Sub Categoría
// ===============================================
app.post('/', [mdAutenticacion.verificarToken, mdAutenticacion.verificarADMIN_ROLE], (req, resp) => {

    var body = req.body;

    var subcategoria = new SubCategoria({
        nombre: (body.nombre).toUpperCase(),
        descripcion: (body.descripcion).toUpperCase(),
        idCategoria: body.idCategoria
    });

    subcategoria.save((err, subcategoriaGuardada) => {
        if (err) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'Error al crear sub categoría',
                errors: err
            });
        }
        resp.status(201).json({
            ok: true,
            subcategoria: subcategoriaGuardada
        });
    });

});


// ===============================================
// Actualizar Sub Categoría
// ===============================================
app.put('/:id', [mdAutenticacion.verificarToken, mdAutenticacion.verificarADMIN_ROLE], (req, resp) => {
    var id = req.params.id;
    var body = req.body;

    SubCategoria.findById(id, (err, subcategoria) => {

        if (err) {
            return resp.status(500).json({
                ok: false,
                mensaje: 'Error al buscar sub categoría',
                errors: err
            });
        }

        if (!subcategoria) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'La sub categoría con el id ' + id + 'no existe',
                errors: { message: 'No existe una sub categoría con ese ID' }
            });

        }

        subcategoria.nombre = (body.nombre).toUpperCase();
        subcategoria.descripcion = (body.descripcion).toUpperCase();
        subcategoria.categoria = body.idCategoria;

        subcategoria.save((err, subcategoriaGuardada) => {
            if (err) {
                return resp.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar sub categoría',
                    errors: err
                });
            }

            resp.status(200).json({
                ok: true,
                subcategoria: subcategoriaGuardada
            });
        });
    });
});

// ===============================================
// Borrar una subcategoría por id
// ===============================================
app.delete('/:id', [mdAutenticacion.verificarToken, mdAutenticacion.verificarADMIN_ROLE], (req, resp) => {


    var id = req.params.id;

    SubCategoria.findByIdAndRemove(id, (err, subcategoriaBorrada) => {

        if (err) {
            return resp.status(500).json({
                ok: false,
                mensaje: 'Error al borrar sub categoría',
                errors: err
            });
        }
        if (!subcategoriaBorrada) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'No existe una sub categoría con ese ID',
                errors: { message: 'No existe una sub categoría con ese ID' }
            });
        }
        resp.status(200).json({
            ok: true,
            subcategoria: subcategoriaBorrada
        });
    });
});
module.exports = app;