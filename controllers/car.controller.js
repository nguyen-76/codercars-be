const { default: mongoose } = require("mongoose");
const Car = require("../models/Car");
const carController = {};

carController.createCar = async (req, res, next) => {
  try {
    const { make, model, transmission_type, size, style, release_date, price } =
      req.body;
    const info = {
      make,
      model,
      transmission_type,
      size,
      style,
      release_date,
      price,
    };
    if (!info) throw new AppError(402, "Bad Request", "Create car Error");
    const created = await Car.create(info);
    res.status(200).send({ message: "Create Car Successfully!", car: created });
  } catch (err) {
    next(err);
  }
};

carController.getCars = async (req, res, next) => {
  try {
    let page = req.query.page ? req.query.page : 1;
    const limit = 10;
    const cars = await Car.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await Car.find().count();

    const response = {
      message: "Get Car List Successfully!",
      page: page,
      total: Math.floor(total / limit),
      cars: cars,
    };

    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};

carController.editCar = async (req, res, next) => {
  try {
    let { id } = req.params;
    const updates = req.body;

    let updatedCar = await Car.findByIdAndUpdate(
      id,
      { ...updates },
      { new: true }
    );
    const response = { message: "Update Car Successfully!", car: updatedCar };

    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};

carController.deleteCar = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) throw new Error("Invalid ID");
    const car = await Car.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, runValidators: true }
    );
    if (!car) throw new Error("Car not found!");
    return res.status(200).send({ message: "Delete Car Successfully!", car });
  } catch (err) {
    next(err);
  }
};

module.exports = carController;
