const express = require("express")
const joi = require("joi")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const config = require("config")
const Usuario = require("../models/usuario_model")

const ruta = express.Router()

ruta.post("/", (req, res) => {
    Usuario.findOne({email: req.body.email})
        .then(user => {
            if(user){
                const passwordValidar = bcrypt.compareSync(req.body.password, user.password)
                if(passwordValidar){
                    const  jwToken = jwt.sign({_id: user._id, nombre: user.nombre, email: user.email}, config.get("configToken.SEED"), {expiresIn: config.get("configToken.expiration")})
                    res.status(200).send({
                        usuario: {
                            _id: user._id,
                            nombre: user.nombre,
                            email: user.email
                        },
                        jwToken
                    })
                    // res.status(200).json({
                    // email: user.email
                    // })
                } else {
                        res.status(400).json({
                        error: "Usuario o Contraseña Incorrecto"
                    })
                }
            }else {
                res.status(400).json({
                    error: "Usuario o Contraseña Incorrecto"
                })
            }
        }).catch(err => {
            res.status(400).json({
                error: "Error en el Servicio"+ err
            })
        })
})

module.exports = ruta