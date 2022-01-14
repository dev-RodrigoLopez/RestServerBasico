const { response } = require('express');
const jwt = require('jsonwebtoken');
const usuario = require('../models/usuario');

const Usuario = require( '../models/usuario' );

const validarJWT = async(  req = request , res = response, next )  =>{

    const token = req.header('x-token');

    if( !token ){
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        })
    }

    try{

        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );
        req.uid = uid;

        //leer el usuario que corresponde al UID
        const usuario = await Usuario.findById( uid );

        if( !usuario ){
            return res.status(401).json({
                msg: 'Token no valido - Usuario no existe en BD'
            })
        }

        //Verificar si el uid tiene estado true
        if( !usuario.estado ){
            return res.status(401).json({
                msg: 'Token no valido - Usuario con estado false'
            })
        }

        req.usuario = usuario


        next();
    }
    catch(error){
        console.log(error);
        res.status(401).json({
            msg: 'Token no valido'
        })
    }


}

module.exports = {
    validarJWT
}