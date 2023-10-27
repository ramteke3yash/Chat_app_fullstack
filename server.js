const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const sequelize = require("./util/database");

const User = require("./models/userModel");
const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    credentials: true,
  })
);

app.use("/user", userRoutes);

sequelize
  .sync() // { force: true }
  .then(() => {
    app.listen(process.env.PORT);
  })
  .catch((err) => {
    console.log(err);
  });
