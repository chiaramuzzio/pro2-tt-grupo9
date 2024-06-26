var express = require('express');
var router = express.Router();
const usersController = require("../controllers/usersController");
const { body } = require('express-validator');
const db = require('../database/models');
const bcrypt = require("bcryptjs");
const session = require('express-session')

//VALIDACIONES
let validationsLogin = [
    body('email')
        .notEmpty().withMessage('El campo Mail es obligatorio.').bail()
        .isEmail().withMessage('Debe ser un email valido').bail()
        .custom(function (value, { req }) {
            return db.Usuario.findOne({ where: { mail: req.body.email }, })
                .then(function (user) {
                    if (user != undefined) {
                        return true;
                    }
                    else {
                        throw new Error('El email no existe')
                    }
                })
        }),

    body('password')
        .notEmpty().withMessage('El campo Contraseña es obligatorio.').bail()
        .custom(function (value, { req }) {

            return db.Usuario.findOne({ where: { mail: req.body.email }, })
                .then(function (result) {
                    if (result != undefined) {

                        let check = bcrypt.compareSync(req.body.password, result.contrasenia);
                        if (!check) {
                            throw new Error('La contraseña es incorrecta')
                        }
                    }
                    else {
                        throw new Error('No existe el mail, registrese')
                    }
                })

        })
]

let validationsRegister = [
    body('email')
        .notEmpty().withMessage('El campo Mail es obligatorio.').bail()
        .isEmail().withMessage('Debe ser un email valido').bail()
        .custom(function (value) {
            return db.Usuario.findOne({ where: { mail: value } })
                .then(function (user) {
                    if (user == undefined) {
                        return true;
                    }
                    else {
                        throw new Error('El email ya existe')
                    }
                })
        }),

    body('username')
        .notEmpty().withMessage('Por favor, introduzca un nombre de usuario'),

    body('password')
        .notEmpty().withMessage('El campo Contraseña es obligatorio.').bail()
        .isLength({ min: 4 }).withMessage('La contraseña debe tener más de 4 caracteres')
]

let validationsEdit = [
    body('usuario')
        .notEmpty().withMessage('Por favor, introduzca un nombre de usuario'),

    body('contrasenia')
    .custom(function (contrasenia) {
        if (contrasenia && contrasenia.length < 4) {
            throw new Error('La contraseña debe tener más de 4 caracteres')
        }
        return true
    })
];

//RUTAS
router.get('/login', usersController.login);
router.post('/login', validationsLogin, usersController.loginUser);

router.get('/register', usersController.register);
router.post('/register', validationsRegister, usersController.store);

router.get('/profile/id/:id', usersController.profile);

router.get('/edit', usersController.usersEdit);
router.post('/edit', validationsEdit, usersController.update);

router.post('/logout', usersController.logout);

module.exports = router;