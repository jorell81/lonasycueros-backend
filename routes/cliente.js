var express = require('express');
var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();
var Cliente = require('../models/cliente');

// ===============================================
// Obtener todos los clientes
// ===============================================
app.get('/', (req, resp) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);
    /*Si quiere buscar campos en especifico
    Categoria.find({}, 'nombre descripcion')*/
    Cliente.find({})
        .skip(desde)
        .limit(10)
        .exec(
            (err, clientes) => {
                if (err) {
                    return resp.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando clientes',
                        errors: err
                    });
                }
                Cliente.countDocuments({}, (err, conteo) => {
                    if (err) {
                        return resp.status(500).json({
                            ok: false,
                            mensaje: 'Error en el conteo de clientes',
                            errors: err
                        });
                    }
                    resp.status(200).json({
                        ok: true,
                        clientes: clientes,
                        mensaje: 'Get de clientes',
                        total: conteo
                    });
                });

            });
});

// ===============================================
// Crear nuevo cliente
// ===============================================
app.post('/', [mdAutenticacion.verificarToken, mdAutenticacion.verificarADMIN_ROLE], (req, resp) => {

    var body = req.body;

    var cliente = new Cliente({
        nombre: body.nombre,
        apellido: body.apellido,
        email: body.email,
        telefono: body.telefono,
        tipoDocumento: body.tipoDocumento,
        numeroIdentificacion: body.numeroIdentificacion,
    });

    cliente.save((err, clienteGuardado) => {
        if (err) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'Error al crear cliente',
                errors: err
            });
        }
        resp.status(201).json({
            ok: true,
            cliente: clienteGuardado
        });
    });


});
// ===============================================
// Actualizar cliente
// ===============================================
app.put('/:id', [mdAutenticacion.verificarToken, mdAutenticacion.verificarADMIN_ROLE], (req, resp) => {
    var id = req.params.id;
    var body = req.body;

    Cliente.findById(id, (err, cliente) => {

        if (err) {
            return resp.status(500).json({
                ok: false,
                mensaje: 'Error al buscar cliente',
                errors: err
            });
        }

        if (!cliente) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'El cliente con el id ' + id + ' no existe',
                errors: { message: 'No existe un cliente con ese ID' }
            });

        }

        cliente.nombre = body.nombre;
        cliente.apellido = body.apellido;
        cliente.email = body.email;
        cliente.telefono = body.telefono;
        cliente.tipoDocumento = body.tipoDocumento;
        cliente.numeroIdentificacion = body.numeroIdentificacion;

        cliente.save((err, clienteGuardado) => {
            if (err) {
                return resp.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar cliente',
                    errors: err
                });
            }

            resp.status(200).json({
                ok: true,
                cliente: clienteGuardado
            });
        });
    });
});

// ===============================================
// Borrar una descuento por id
// ===============================================
app.delete('/:id', [mdAutenticacion.verificarToken, mdAutenticacion.verificarADMIN_ROLE], (req, resp) => {


    var id = req.params.id;

    Cliente.findByIdAndRemove(id, (err, clienteGuardado) => {

        if (err) {
            return resp.status(500).json({
                ok: false,
                mensaje: 'Error al borrar cliente',
                errors: err
            });
        }
        if (!clienteGuardado) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'No existe un cliente con ese ID',
                errors: { message: 'No existe un cliente con ese ID' }
            });
        }
        resp.status(200).json({
            ok: true,
            cliente: clienteGuardado
        });
    });
});
module.exports = app;