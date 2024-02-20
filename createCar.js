const fs = require("fs");
const csv = require("csvtojson");
const Car = require("./models/Car");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/Codercars", () => {
  console.log("Connected to Database!");
});

const createCar = async () => {
  let newData = await csv().fromFile("data.csv");
  newData = newData.map((e) => {
    return {
      make: e.Make,
      model: e.Model,
      release_date: Number(e.Year),
      transmission_type: e["Transmission Type"],
      style: e["Vehicle Style"],
      size: e["Vehicle Size"],
      price: Number(e.MSRP),
    };
  });
  newData.forEach((e) => {
    Car.create(e);
  });
};
createCar();
