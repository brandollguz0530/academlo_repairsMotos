const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.PROTECT = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message:
        'No ha iniciado sesión, por favor inicie sesión para obtener acceso',
    });
  }

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.SECRET_JWT_SEED
  );

  const user = await User.findOne({
    where: {
      id: decoded.id,
      status: 'available',
    },
  });

  if (!user) {
    return res.status(401).json({
      status: 'error',
      message: 'El propietario de este token ya no está disponible 😒',
    });
  }

  req.sessionUser = user;

  next();
};

exports.protectAccountOwner = catchAsync(async (req, res, next) => {
  const { user, sessionUser } = req;
  if (user.id !== sessionUser.id) {
    return next(new AppError('Esta no es tu cuenta', 401));
  }

  next();
});

exports.restricTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.sessionUser.role)) {
      return res.status(403).json({
        status: 'error',
        message: '¡No tienes permiso para realizar esta acción! 😕',
      });
    }
    next();
  };
};
