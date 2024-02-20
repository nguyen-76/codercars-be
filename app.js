const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const indexRouter = require("./routes/index");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Connect to MONGODB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(`DB connected ${process.env.MONGO_URI}`))
  .catch((err) => console.log(err));

app.use("/", indexRouter);

module.exports = app;
