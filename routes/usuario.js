var express = require('express');
var bcrypt = require('bcryptjs');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Usuario = require('../models/usuario');

// ===============================================
// Obtener todos los usuario
// ===============================================
app.get('/', (req, resp, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Usuario.find({}, 'nombre apellido email img role google')
        .skip(desde)
        .limit(5)
        .exec(
            (err, usuarios) => {
                if (err) {
                    return resp.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuarios',
                        errors: err
                    });
                }

                Usuario.countDocuments({}, (err, conteo) => {
                    if (err) {
                        return resp.status(500).json({
                            ok: false,
                            mensaje: 'Error en el conteo de usuarios',
                            errors: err
                        });
                    }
                    resp.status(200).json({
                        ok: true,
                        usuarios: usuarios,
                        mensaje: 'Get de usuarios',
                        total: conteo
                    });
                });

            });

});



// ===============================================
// Actualizar usuario
// ===============================================
app.put('/:id', mdAutenticacion.verificarToken, (req, resp) => {
    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {

        if (err) {
            return resp.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuario) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id ' + id + 'no existe',
                errors: { message: 'No existe un usuario con ese ID' }
            });

        }


        usuario.nombre = body.nombre;
        usuario.apellido = body.apellido;
        usuario.email = body.email;
        usuario.role = body.role;


        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return resp.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            }

            usuarioGuardado.password = ':)';

            resp.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });

        });
    });
});




// ===============================================
// Crear nuevo usuario
// ===============================================

app.post('/', (req, resp) => {

    var body = req.body;
    var usuario = new Usuario({
        nombre: body.nombre,
        apellido: body.apellido,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        }
        resp.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuariotoken: req.usuario
        });
    });



});

// ===============================================
// Borrar un usuario por el id
// ===============================================
app.delete('/:id', mdAutenticacion.verificarToken, (req, resp) => {


    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

        if (err) {
            return resp.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err
            });
        }
        if (!usuarioBorrado) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con ese ID',
                errors: { message: 'No existe un usuario con ese ID' }
            });
        }
        resp.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});

module.exports = app;