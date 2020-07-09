var express = require('express');
var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();
var Descuento = require('../models/descuento');

// ===============================================
// Obtener todos los descuentos
// ===============================================
app.get('/', (req, resp, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);
    /*Si quiere buscar campos en especifico
    Categoria.find({}, 'nombre descripcion')*/
    Descuento.find({})
        .skip(desde)
        .limit(10)
        .populate('producto')
        .exec(
            (err, descuentos) => {
                if (err) {
                    return resp.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando descuentos',
                        errors: err
                    });
                }
                Descuento.countDocuments({}, (err, conteo) => {
                    if (err) {
                        return resp.status(500).json({
                            ok: false,
                            mensaje: 'Error en el conteo de descuentos',
                            errors: err
                        });
                    }
                    resp.status(200).json({
                        ok: true,
                        descuentos: descuentos,
                        mensaje: 'Get de Descuentos',
                        total: conteo
                    });
                });

            });
});

// ===============================================
// Crear nuevo descuento
// ===============================================
app.post('/', [mdAutenticacion.verificarToken, mdAutenticacion.verificarADMIN_ROLE], (req, resp) => {

    var body = req.body;

    var descuento = new Descuento({
        fechaInicio: body.fechaInicio,
        fechaFin: body.fechaFin,
        valorDescuento: body.valorDescuento,
        idProducto: body.idProducto
    });

    descuento.save((err, descuentoGuardado) => {
        if (err) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'Error al crear descuento',
                errors: err
            });
        }
        resp.status(201).json({
            ok: true,
            descuento: descuentoGuardado
        });
    });


});
// ===============================================
// Actualizar descuento
// ===============================================
app.put('/:id', [mdAutenticacion.verificarToken, mdAutenticacion.verificarADMIN_ROLE], (req, resp) => {
    var id = req.params.id;
    var body = req.body;

    Descuento.findById(id, (err, descuento) => {

        if (err) {
            return resp.status(500).json({
                ok: false,
                mensaje: 'Error al buscar descuento',
                errors: err
            });
        }

        if (!descuento) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'El descuento con el id ' + id + ' no existe',
                errors: { message: 'No existe un descuento con ese ID' }
            });

        }

        descuento.fechaInicio = body.fechaInicio;
        descuento.fechaFin = body.fechaFin;
        descuento.valorDescuento = body.valorDescuento;
        descuento.idProducto = body.idProducto;

        descuento.save((err, descuentoGuardado) => {
            if (err) {
                return resp.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar descuento',
                    errors: err
                });
            }

            resp.status(200).json({
                ok: true,
                descuento: descuentoGuardado
            });
        });
    });
});

// ===============================================
// Borrar una descuento por id
// ===============================================
app.delete('/:id', [mdAutenticacion.verificarToken, mdAutenticacion.verificarADMIN_ROLE], (req, resp) => {


    var id = req.params.id;

    Descuento.findByIdAndRemove(id, (err, descuentoGuardado) => {

        if (err) {
            return resp.status(500).json({
                ok: false,
                mensaje: 'Error al borrar descuento',
                errors: err
            });
        }
        if (!descuentoGuardado) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'No existe un descuento con ese ID',
                errors: { message: 'No existe un descuento con ese ID' }
            });
        }
        resp.status(200).json({
            ok: true,
            descuento: descuentoGuardado
        });
    });
});
module.exports = app;