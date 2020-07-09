var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;
var productoSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'], unique: true },
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
}, { collection: 'productos' });
productoSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' });
module.exports = mongoose.model('Producto', productoSchema);