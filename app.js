// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


const Enviroment = (process.env.PORT || '').length > 0 ? '/ServLonasyCueros' : '';
const Port = process.env.PORT || 3000;

// Inicializar variables
var app = express();

// CORS
var cors = require('cors');

app.use(cors());



// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Importa rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var categoriaRoutes = require('./routes/categoria');
var subcategoriaRoutes = require('./routes/subcategoria');
var productoRoutes = require('./routes/producto');
var descuentoRoutes = require('./routes/descuento');
var clienteRoutes = require('./routes/cliente');
var busquedaRoutes = require('./routes/busqueda');
var testRoutes = require('./routes/test');



// Conexion a la base de datos
// mongoose.connect('mongodb://localhost:27017/hospitalDB', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false });
mongoose.connect('mongodb://localhost:27017/lonasycueros', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
});
// Conexion antigua
/* mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, {useNewUrlParser: true} ) => {
    if (err) throw err;

    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
}); */

// Rutas
app.use(Enviroment + '/usuario', usuarioRoutes);
app.use(Enviroment + '/login', loginRoutes);
app.use(Enviroment + '/categoria', categoriaRoutes);
app.use(Enviroment + '/subcategoria', subcategoriaRoutes);
app.use(Enviroment + '/producto', productoRoutes);
app.use(Enviroment + '/descuento', descuentoRoutes);
app.use(Enviroment + '/cliente', clienteRoutes);
app.use(Enviroment + '/busqueda', busquedaRoutes);
app.use(Enviroment + '/test', testRoutes);
app.use(Enviroment + '/', appRoutes);




// Escuchar peticiones
// Escuchar peticiones
app.listen(Port, () => {
    console.log('Express server corriendo en el puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});