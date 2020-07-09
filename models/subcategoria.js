var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');


var Schema = mongoose.Schema;


var subcategoriaSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'], unique: true },
    descripcion: { type: String, required: [true, 'La descripción es necesaria'] },
    idCategoria: { type: Schema.Types.ObjectId, ref: 'categoria', required: [true, 'El id categoría es un campo obligatorio'] }
}, { collection: 'subcategorias' });

subcategoriaSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' });
module.exports = mongoose.model('subcategoria', subcategoriaSchema);