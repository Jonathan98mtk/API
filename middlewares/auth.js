const jwt = require("jsonwebtoken")
const config = require("config")

//Se crea la funcion donde tenemos como parametro req, res y next para que continue
//con el siguiente paso de la funcionalidad de verificar token
let verificarToken = (req, res, next) => {
    //Obtenemos el token de la solicitud
    let token = req.get("Authorization")

    //Verificamos el token pasandole como parámetro el token, la semilla y una funcion callback
    jwt.verify(token, config.get("configToken.SEED"), (err, decoded) => {

        //Si hay un error entramos en la condicion
        if (err){
            return res.status(401).json({
                error: err
            })
        }
        //en caso de que no haya error enviamos el tokem
        res.usuario = decoded.usuario
        next()
    })
}

module.exports = verificarToken