const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');
const generateJWT = require('../utils/jwt');
const bcrypt = require('bcryptjs');

exports.findUsers = catchAsync(async (req, res) => {
  const users = await User.findAll({
    where: {
      status: 'available',
    },
  });

  return res.json({
    message: 'Users found',
    results: users.length,
    users,
  });
});

exports.createUser = catchAsync(async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const salt = await bcrypt.genSalt(12);
    const encryptedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name.toLowerCase(),
      email: email.toLowerCase(),
      password: encryptedPassword,
      role,
    });

    res.status(201).json({
      message: 'El usuario ha sido creado! 🙌🏻',
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'fail',
      message: 'Algo salió muy mal',
    });
  }
});

exports.findAUser = catchAsync(async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({
      where: {
        id,
        status: 'available',
      },
    });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: `El usuario con id: ${id} no existe 😕`,
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Usuario encontrado',
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'fail',
      message: '¡Algo salió muy mal! 😕',
    });
  }
});

exports.updateUser = catchAsync(async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const user = await User.findOne({
      where: {
        id,
        status: 'available',
      },
    });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: `El Usuaro con id: ${id} no existe`,
      });
    }

    await user.update({ name, email });

    res.status(200).json({
      status: 'success',
      message: 'El usuario ha sido actualizado',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'fail',
      message: '¡Algo salió muy mal!',
    });
  }
});

exports.deleteUser = catchAsync(async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({
      where: {
        id,
        status: 'available',
      },
    });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: `El Usuario con id: ${id} no existe `,
      });
    }

    await user.update({ status: 'unavailable' });

    return res.status(200).json({
      status: 'success',
      message: `¡Cuenta de usuario inhabilitada!`,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'fail',
      message: '¡Algo salió muy mal!',
    });
  }
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: {
      email,
    },
  });

  if (!(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({
      status: 'error',
      message: 'Correo o contraseña incorrectos',
    });
  }

  const token = await generateJWT(user.id);

  res.status(200).json({
    status: 'success',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});
