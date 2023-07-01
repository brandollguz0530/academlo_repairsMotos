const { body, validationResult } = require('express-validator');

const validFields = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      errors: errors.mapped(),
    });
  }
  next();
};

exports.createUserValidation = [
  body('name').notEmpty().withMessage('El nombre no puede estar vacío'),

  body('email')
    .notEmpty()
    .withMessage('El correo electrónico no puede estar vacío')
    .isEmail()
    .withMessage('Debe ser un correo electrónico válido'),

  body('password')
    .notEmpty()
    .withMessage('La contraseña no puede estar vacía')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres'),

  validFields,
];

exports.createRepairValidation = [
  body('date')
    .isDate()
    .withMessage(
      'el inicio debe tener el formato correcto aaaa:mm:dd hh:mm:ss'
    ),

  body('userId')
    .isInt()
    .notEmpty()
    .withMessage('La identificación no puede estar vacía'),

  validFields,
];
