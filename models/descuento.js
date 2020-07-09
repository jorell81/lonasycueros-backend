var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var descuentoSchema = new Schema({
    fechaInicio: { type: Date, required: [true, 'La fecha de inicio del descuento es necesaria'] },
    fechaFin: { type: Date, required: [true, 'La fecha de fin del descuento es necesaria'] },
    valorDescuento: { type: Number, required: [true, 'El porcentaje de descuento es necesario'] },
    idProducto: { type: Schema.Types.ObjectId, ref: 'Producto', required: [true, 'El id producto es obligatorio'] },

}, { collection: 'descuentos' });
module.exports = mongoose.model('Descuento', descuentoSchema);