var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Medico = require('../models/medico');

// ===============================================
// Obtener todos los medicos
// ===============================================
app.get('/', (req, resp, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);
    /*Si quiere buscar campos en especifico
    Medico.find({}, 'nombre img usuario')*/
    Medico.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('hospital', 'nombre email')
        .exec(
            (err, medicos) => {
                if (err) {
                    return resp.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando medicos',
                        errors: err
                    });
                }
                Medico.count({}, (err, conteo) => {
                    if (err) {
                        return resp.status(500).json({
                            ok: false,
                            mensaje: 'Error en el conteo de medicos',
                            errors: err
                        });
                    }
                    resp.status(200).json({
                        ok: true,
                        medicos: medicos,
                        mensaje: 'Get de medicos',
                        total: conteo
                    });
                });

            });

});
// ===============================================
// Obtener medico
// ===============================================
app.get('/:id', (req, resp) => {
    var id = req.params.id;

    Medico.findById(id)
        .populate('usuario', 'nombre email img')
        .populate('hospital')
        .exec((err, medico) => {
            if (err) {
                return resp.status(400).json({
                    ok: false,
                    mensaje: 'Error al buscar medico',
                    errors: err
                });
            }

            if (!medico) {
                return resp.status(400).json({
                    ok: false,
                    mensaje: 'El medico con el id ' + id + 'no existe',
                    errors: { message: 'No existe un medico con ese ID' }
                });
            }

            resp.status(200).json({
                ok: true,
                medico: medico
            });

        });

});



// ===============================================
// Crear nuevo medico
// ===============================================
app.post('/', mdAutenticacion.verificarToken, (req, resp) => {

    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save((err, medicoGuardado) => {
        if (err) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'Error al crear medico',
                errors: err
            });
        }
        resp.status(201).json({
            ok: true,
            medico: medicoGuardado
        });
    });



});

// ===============================================
// Actualizar medico
// ===============================================
app.put('/:id', mdAutenticacion.verificarToken, (req, resp) => {
    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico) => {

        if (err) {
            return resp.status(500).json({
                ok: false,
                mensaje: 'Error al buscar medico',
                errors: err
            });
        }

        if (!medico) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'El medico con el id ' + id + 'no existe',
                errors: { message: 'No existe un medico con ese ID' }
            });
        }


        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;


        medico.save((err, medicoGuardado) => {
            if (err) {
                return resp.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar medico',
                    errors: err
                });
            }

            resp.status(200).json({
                ok: true,
                medico: medicoGuardado
            });

        });
    });
});

// ===============================================
// Borrar un Medico por el id
// ===============================================
app.delete('/:id', mdAutenticacion.verificarToken, (req, resp) => {


    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {

        if (err) {
            return resp.status(500).json({
                ok: false,
                mensaje: 'Error al borrar medico',
                errors: err
            });
        }
        if (!medicoBorrado) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'No existe un medico con ese ID',
                errors: { message: 'No existe un medico con ese ID' }
            });
        }
        resp.status(200).json({
            ok: true,
            Medico: medicoBorrado
        });
    });
});

module.exports = app;