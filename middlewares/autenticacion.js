var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;


// ===============================================
// Verificar token
// ===============================================
exports.verificarToken = function(req, resp, next) {

    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {

        if (err) {
            return resp.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }
        req.usuario = decoded.usuario;

        next();
    });

}

// ===============================================
// Verificar ADMIN
// ===============================================
exports.verificarADMIN_ROLE = function(req, resp, next) {

    var usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
        return;
    } else {
        return resp.status(401).json({
            ok: false,
            mensaje: 'Token incorrecto',
            errors: { message: 'No es administrador, acción prohibida' }
        });
    }

}

// ===============================================
// Verificar ADMIN o mismo usuario
// ===============================================
exports.verificarADMIN_o_MismoUsuario = function(req, resp, next) {

    var usuario = req.usuario;
    var id = req.params.id;

    if (usuario.role === 'ADMIN_ROLE' || usuario._id === id) {
        next();
        return;
    } else {
        return resp.status(401).json({
            ok: false,
            mensaje: 'Token incorrecto - No es administrado ni es el mismo usuario logueado',
            errors: { message: 'No es administrador, no puede hacer eso' }
        });
    }

}