//Importar dependencias
const moongose = require("mongoose") //Usar mongo

//Crear esquema de usuarios (estructura de coleccion) e instancia de Schema
const usuario_esquema = new moongose.Schema({
    email: {
        type: String,
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    estado: {
        type: Boolean,
        default: true
    }
})

//Exportamos el modelo
module.exports = moongose.model("Usuario", usuario_esquema)