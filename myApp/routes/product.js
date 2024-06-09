var express = require('express');
var router = express.Router();
const productController = require("../controllers/productController");
const { body } = require('express-validator');

let validations = [
    body('nombreProd')
        .notEmpty().withMessage('El campo Nombre del Producto es obligatorio.'),
    body('descripcion')
        .notEmpty().withMessage('El campo Descripción es obligatorio.'),
    body('imagenProd')
        .notEmpty().withMessage('El campo Imagen es obligatorio.').bail()
        .isURL().withMessage('El campo Imagen debe ser una URL válida.')
]

router.get('/id/:id', productController.index);

router.get('/add', productController.create);
router.post('/add', validations, productController.store);

router.post('/editProduct', productController.formUpdate);
router.post('/edit', validations, productController.update);

router.post('/delete', productController.destroy);


module.exports = router;