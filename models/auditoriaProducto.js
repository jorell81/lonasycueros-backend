var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var auditoriaProductoSchema = new Schema({
    idProducto: { type: Schema.Types.ObjectId, ref: 'Producto', required: [true, 'El id producto es un campo obligatorio'] },
    nombreAnterior: { type: String, required: [true, 'El nombre anteior es necesario'] },
    idSubCategoria: { type: Schema.Types.ObjectId, ref: 'subcategoria', required: [true, 'El id sub categoría es un campo obligatorio'] },
    codigoBarras: { type: String, required: false },
    valorEntrada: { type: Number, required: [true, 'El valor de entrada es necesario'] },
    valorSalida: { type: Number, required: [true, 'El valor de salida es necesario'] },
    bodega: { type: Number, required: [true, 'El valor en bodega es necesario'] },
    talla: { type: String, required: [true, 'La talla es necesaria'] },
    color: { type: String, required: [true, 'El color es necesario'] },
    marca: { type: String, required: [true, 'La marca es necesaria'] },
    genero: { type: String, required: [true, 'El genero es necesario'] },
    fechaRegistro: { type: Date, default: Date.now, required: [true, 'La fecha de registro es necesaria'] }
}, { collection: 'auditoria' });
module.exports = mongoose.model('auditoria', auditoriaProductoSchema);