const Repair = require('../models/repair.model');
const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');


exports.findRepairs = catchAsync(async(req, res) => {
  try {
    const repairs = await Repair.findAll({
      where: {
        status: 'pending' || 'completed', 
      },
      attributes: {
        exclude: ['id', 'password']
      },
      include: [
        {
          model: User,
          attributes: ['name', 'email', 'role', 'status']
        }
      ]
    });

    return res.json({
      results: repairs.length,
      status: 'success',
      message: 'Repair found',
      repairs,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'fail',
      message: 'Something went very wrong',
    });
  }
})

exports.createRepair = catchAsync(async(req, res) => {
  try {
    const { date, userId, description, motorsNumber } = req.body;

    const repair = await Repair.create({
      date,
      userId,
      description,
      motorsNumber
    });

    return res.status(201).json({
      message: 'The repair has been created!',
      repair,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'fail',
      message: 'Something went very wrong',
    });
  }
})

exports.findARepair = catchAsync(async(req, res) => {
  try {
    const { id } = req.params

    const repair = await Repair.findOne({
      where: {
        id,
        status: 'pending'
      }
    })

    if (!repair) {
      return res.status(404).json({
        status: 'error',
        message: `The repair with id: ${id} doesn't exist`,
      })
    }

    return res.status(200).json({
      status: 'success',
      message: 'Repair found',
      repair
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      status: 'fail',
      message: 'Something went very wrong!'
    })
  }
})

exports.updateRepair = catchAsync(async(req, res) => {
  try {
    const { id } = req.params;

    const repair = await Repair.findOne({
      where: {
        id,
      },
    });


    if(!repair) {
      return res.status(404).json({
        status: 'error',
        message: `Repair with id: ${id} doesn't exist`,
      });
    }

    await repair.update({ status: 'completed' });

    res.status(200).json({
      status: 'success',
      message: 'Repair has been updated',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'fail',
      message: 'Something went very wrong!',
    });
  }
})

exports.deleteRepair = catchAsync(async(req, res) => {
  try {
    const { id } = req.params;

    const repair = await Repair.findOne({
      where: {
        status: 'pending',
        id,
      },
    });

    if (!repair) {
      return res.status(404).json({
        status: 'error',
        message: `Repair with id: ${id} doesn't exist!`,
      });
    }

    await repair.update({ status: 'cancelled' });

    return res.status(200).json({
      status: 'success',
      message: 'the repair has been deleted!',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'fail',
      message: 'Something went very wrong!',
    });
  }
})
