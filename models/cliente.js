var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;


var clienteSchema = new Schema({

    nombre: { type: String, required: [true, 'El nombre es requerido'] },
    apellido: { type: String, required: [true, 'El apellido es requerido'] },
    email: { type: String, unique: true, required: [true, 'El correo es requerido'] },
    telefono: { type: String, required: [true, 'El teléfono es requerido'] },
    tipoDocumento: { type: Schema.Types.ObjectId, ref: 'tipoDocumento', required: [true, 'El teléfono es requerido'] },
    numeroIdentificacion: { type: String, required: [true, 'El número de identificación es requerido'], unique: true },
});

clienteSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' });
module.exports = mongoose.model('cliente', clienteSchema);