const fs = require("fs");
const csv = require("csvtojson");
const Car = require("./models/Car");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/Codercars", () => {
  console.log("Connected to Database!");
});

const createCar = async () => {
  let newData = await csv().fromFile("data.csv");
  newData = Array.from(newData);
  newData = newData.map((car) => {
    return {
      make: car.Make,
      model: car.Model,
      release_date: Number(car.Year),
      transmission_type: car["Transmission Type"],
      size: car["Vehicle Size"],
      style: car["Vehicle Style"],
      price: Number(car.MSRP),
    };
  });
  await Car.create(newData).then(() => console.log("create success"));
};
createCar();
