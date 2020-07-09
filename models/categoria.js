var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');


var Schema = mongoose.Schema;


var categoriaSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'], unique: true },
    descripcion: { type: String, required: [true, 'La descripción es necesaria'] }
}, { collection: 'categorias' });

categoriaSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' });
module.exports = mongoose.model('categoria', categoriaSchema);