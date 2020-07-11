var express = require('express');
var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();
var Producto = require('../models/producto');
var auditoria = require('../models/auditoriaProducto');
// ===============================================
// Obtener todos los productos
// ===============================================
app.get('/', (req, resp, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);
    /*Si quiere traer campos en especifico
    Categoria.find({}, 'nombre descripcion')*/
    Producto.find({})
        .skip(desde)
        .limit(10)
        .populate('idSubCategoria', 'nombre idCategoria')
        .exec(
            (err, productos) => {
                if (err) {
                    return resp.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando productos',
                        errors: err
                    });
                }
                Producto.countDocuments({}, (err, conteo) => {
                    if (err) {
                        return resp.status(500).json({
                            ok: false,
                            mensaje: 'Error en el conteo de productos',
                            errors: err
                        });
                    }
                    resp.status(200).json({
                        ok: true,
                        productos: productos,
                        mensaje: 'Get de Productos',
                        total: conteo
                    });
                });

            });
});

// ===============================================
// Crear nuevo producto
// ===============================================
app.post('/', [mdAutenticacion.verificarToken, mdAutenticacion.verificarADMIN_ROLE], (req, resp) => {


    var body = req.body;

    var producto = new Producto({
        nombre: (body.nombre + ' - ' + body.talla + ' - ' + body.color).toUpperCase(),
        idSubCategoria: body.idSubCategoria,
        bodega: body.bodega,
        valorEntrada: body.valorEntrada,
        valorSalida: body.valorSalida,
        talla: (body.talla).toUpperCase(),
        color: (body.color).toUpperCase(),
        marca: (body.marca).toUpperCase(),
        genero: (body.genero).toUpperCase(),
    });

    producto.save((err, productoGuardado) => {
        if (err) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'Error al crear producto',
                errors: err
            });
        }

        producto.codigoBarras = (productoGuardado._id).toString().slice(8, 24);
        producto.save((err, productoGuardado) => {
            if (err) {
                return resp.status(400).json({
                    ok: false,
                    mensaje: 'Error al crear producto',
                    errors: err
                });
            }
            resp.status(201).json({
                ok: true,
                producto: productoGuardado
            });
        });

    });




});
// ===============================================
// Actualizar Producto
// ===============================================
app.put('/:id', [mdAutenticacion.verificarToken, mdAutenticacion.verificarADMIN_ROLE], (req, resp) => {
    var id = req.params.id;
    var body = req.body;
    Producto.findById(id, (err, producto) => {

        if (err) {
            return resp.status(500).json({
                ok: false,
                mensaje: 'Error al buscar producto',
                errors: err
            });
        }
        if (!producto) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'El producto con el id ' + id + 'no existe',
                errors: { message: 'No existe un producto con ese ID' }
            });

        }

        insertarAuditoria(producto);

        producto.nombre = body.nombre;
        producto.idSubCategoria = body.idSubCategoria;
        producto.bodega = body.bodega;
        producto.codigoBarras = body.codigoBarras;
        producto.valorEntrada = body.valorEntrada;
        producto.valorSalida = body.valorSalida;
        producto.talla = body.talla;
        producto.color = body.color;
        producto.marca = body.marca;
        producto.genero = body.genero;

        producto.save((err, productoGuardado) => {
            if (err) {
                return resp.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar producto',
                    errors: err
                });
            }
            resp.status(200).json({
                ok: true,
                producto: productoGuardado
            });


        });
    });

});

// ===============================================
// Borrar una subcategoría por id
// ===============================================
app.delete('/:id', [mdAutenticacion.verificarToken, mdAutenticacion.verificarADMIN_ROLE], (req, resp) => {


    var id = req.params.id;

    Producto.findByIdAndRemove(id, (err, productoGuardado) => {

        if (err) {
            return resp.status(500).json({
                ok: false,
                mensaje: 'Error al borrar producto',
                errors: err
            });
        }
        if (!productoGuardado) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'No existe un producto con ese ID',
                errors: { message: 'No existe un producto con ese ID' }
            });
        }
        resp.status(200).json({
            ok: true,
            producto: productoGuardado
        });
    });
});


function insertarAuditoria(producto) {

    var auditoriaproducto = new auditoria({
        nombreAnterior: producto.nombre,
        idProducto: producto._id,
        idSubCategoria: producto.idSubCategoria,
        bodega: producto.bodega,
        codigoBarras: producto.codigoBarras,
        valorEntrada: producto.valorEntrada,
        valorSalida: producto.valorSalida,
        talla: producto.talla,
        color: producto.color,
        marca: producto.marca,
        genero: producto.genero
    });

    auditoriaproducto.save((err, auditProductoGuardado) => {});


}

module.exports = app;