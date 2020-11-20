// Importar dependencias
const express = require("express") //Levantar service a inter
const mongoose = require("mongoose") //Usar mongo
const config = require("config") //usar config
//Importar Archivos
const auth = require("./routes/auth")
const usuarios = require("./routes/usuarios") //Importar de usuarios.js


//Crear instancia de la Aplicación
const app = express() //Crear Instancia

//Le decimos a la app que use express.json
app.use(express.json())
//Le decimos que utlice express.urlencoded
app.use(express.urlencoded({extended: true}))
//Agregamos las rutas
app.use("/api/usuarios", usuarios)
app.use("/api/auth", auth)

//Crear conexión a MONGODB
mongoose.connect(config.get("configDB.HOST"), {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(() => console.log("Conectado a MongoDB"))
  .catch(err => console.log("No se pudo realizar la conexion a MongoDB...", err))

//Creamos nuestra constante del puerto
const port = process.env.PORT || 3000

//Corremos el Servicio
app.listen(port, () => {
    console.log("API Funcionando");
})


