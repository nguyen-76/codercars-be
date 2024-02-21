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
    let skip = (page - 1) * limit;
    const cars = await Car.find({}).skip(skip).limit(limit);
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
  const { id } = req.params;
  const { make, model, transmission_type, size, style, release_date, price } =
    req.body;
  const updateInfo = {
    make,
    model,
    transmission_type,
    size,
    style,
    release_date,
    price,
  };

  const options = { new: true };

  if (!Object.keys(updateInfo))
    throw new AppError(402, "Bad Request", "Edit car Error");

  try {
    const car = await Car.findById(id, { isDeleted: false });

    if (!car) throw new Error("Car is not exist");

    const updated = await Car.findByIdAndUpdate(id, updateInfo, options);

    if (!updated) throw new Error("Car is not exist");

    res.status(200).send({ message: "Edit car successfully", car: updated });
  } catch (err) {
    next(err);
  }
};

carController.deleteCar = async (req, res, next) => {
  const { id } = req.params;

  const options = { new: true };

  try {
    const deletedCar = await Car.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
      },
      options
    );

    res
      .status(200)
      .send({ cars: deletedCar, message: "Delete car successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = carController;
