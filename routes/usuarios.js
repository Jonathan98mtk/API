//Importar dependencias
const express = require("express")
const joi = require("joi")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const config = require("config")

const Usuario = require("../models/usuario_model")
const verificarToken = require("../middlewares/auth")

//Se importa la funcion router de express
const ruta = express.Router()

//Se crea el esquema de las validaciones con sus devidas restricciones 
const schema = joi.object({
    nombre: joi.string()
        .pattern(new RegExp('^[a-zA-ZäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚÂÊÎÔÛâêîôûàèìòùÀÈÌÒÙ ]{3,100}$')),

    password: joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

    email: joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9._]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$'))
})

//Se crea la ruta get
ruta.get("/", verificarToken, (req, res) => {
    let resultado = listarUsuariosActivos()
    resultado.then(user => {
        res.status(200).json({
            usuarios_activos: user
        })
    }).catch(err => {
        res.status(400).json({
            error: err
        })
    })
})

//Se crea la ruta POST
ruta.post("/",(req, res) => {
    //Obtenemos el body de la solicitud HTTP
    let body = req.body

    const {error, value} = schema.validate({email: body.email, nombre: body.nombre})

    if(!error){

        //Mandamos a llamar la funcion crear usuario pasándole el body como parámetro
        let resultado = crearUsuario(body)
        //Resolvemos la promesa que nos da la funcion crear usuario
        resultado.then(user => {
            if (user){
            //Respondemos a la Solicitud
            res.status(200).json({
                nombre: user.nombre,
                email: user.email
            })
        } else {
            res.status(400).json({
                error: "El usuario ya existe"
            })
        }
        }).catch(err => {
            //Respondemos con un status 400 y con el mensaje del error
            res.status(400).json({
                error: err
            })
        })
    } else{
        res.status(400).json({
            error: error
        })
    }
})

ruta.put("/:email", verificarToken, (req, res) => {
    let email = req.params.email
    let body = req.body
    const {error, value} = schema.validate({nombre: body.nombre})

    if(!error){       
        let resultado = actualizarUsuario(email, body)
        resultado.then(user => {
            res.status(200).json(  
            {
                usuario_actualizado:
                {
                nombre: user.nombre,
                email: user.email
                }
            })
        }).catch(err => {
            res.status(400).json({
                error: err
            })
        })
    } else{
        res.status(400).json({
            error: error
        })
    }
})

//Se crea la ruta DELETE
ruta.delete("/:email", verificarToken, (req, res) => {
   let email = req.params.email
   let resultado = desactivarUsuario(email)
     resultado.then(user => {
        res.status(200).json(
        { usuario_eliminado:
            {
            nombre: user.nombre,
            email: user.email
            }   
        }
            )
    }).catch(err => {
        res.status(400).json({
            error: err
        })
    })
})

//Creamos la funcion para registrar usuario
//Body es lo que recibimos en la solicitud
async function crearUsuario(body){
     let email = await Usuario.findOne({email: body.email})
    if (email) {
        return
    } else{
        //Creamos una instancia de usuarios que es el modelo
        let usuario = new Usuario({
            email: body.email,
            nombre: body.nombre,
            password: bcrypt.hashSync(body.password, 10)
        })
        //Retornamos el usuario guardado
        return await usuario.save()
    }
}

//Se crea la funcioon para actualizar el usuario
//Correo es el dato que utilizamos como identificador del usuario

async function actualizarUsuario(correo, body){
    let usuario = await Usuario.findOneAndUpdate({email: correo}, {
        $set: {
            nombre: body.nombre,
            password: bcrypt.hashSync(body.password, 10)
        }
    }, {new: true})
    return usuario
}

//Se crea la funcion para Desactivar usuarios
//Correo es el parametro que utilizamos para actuaqlizar el estado
async function desactivarUsuario(email){
    let usuario = await Usuario.findOneAndUpdate({email: email}, {
        $set: {
            estado: false
        }
    }, {new: true} )

    return usuario
}

//funcion para enlistar a los usuarios activos
async function listarUsuariosActivos(){
    let usuarios = await Usuario.find({estado: true}).select({nombre: 1, email: 1, _id: 0})
    return usuarios
}

//Exportar ruta
module.exports = ruta