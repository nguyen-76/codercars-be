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
    const filterKeys = Object.keys(filterQuery);
    console.log(filterQuery);
    if (filterKeys.length) {
      const exception = new Error("Only accept page query");
      throw exception;
    }

    let allCars = await Car.find();
    allCars = allCars.filter((item) => item.isDeleted === false);
    const totalPages = parseInt(allCars.length / 10);
    page = parseInt(page) || 1;
    let limit = 10;
    let offset = limit * (page - 1);
    allCars = allCars.slice(offset, offset + limit);

    const response = {
      message: "Get Car List Successfully!",
      page: page,
      total: totalPages,
      cars: allCars,
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
