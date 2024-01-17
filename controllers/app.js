const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const burgerModel = require("../models/burger_model");
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const port = 3000;

function verifyMime(req, res, next) {
  // if (req.is("html") == true) {
  next();
  /*
  } else {
    res.status(400).send("Bad request");
  }
  */
}

function verifyBody(req, res, next) {
  /*
  if (req.body.name != "") {
    if (req.body.popularity > 3 && req.body.popularity < 0) {
      */
  next();
  /*
    } else {
      res
        .status(400)
        .send("the field popularity is required and respect the format");
    }
  } else {
    res.status(400).send("the field name is required and respect the format");
  }
  */
}

function response(data, code, res) {
  const response = [
    {
      data: data.burger,
    },
    {
      message: data.message,
    },
    {
      status: data.status,
    },
  ];

  res.status(code);
  res.json(response);
}

const verify = [verifyBody, verifyMime];

app.get("/api/burgers", async (req, res) => {
  let data = [];
  try {
    await mongoose.connect("mongodb://root:example@mongodb:27017/admin");
    console.log("Connected to db");
    const burgers = await burgerModel.find(
      {},
      { name: 1, popularity: 1, _id: 0 }
    );
    data.burger = burgers;
    data.message = "burgers found";
    data.status = "ok";
    response(data, 200, res);
  } catch (error) {
    data.message = error;
    data.status = "ko";
    data.burger = null;
    response(data, 500, res);
  } finally {
    await mongoose.connection.close();
    console.log("Disconnected to db");
  }
});

app.get("/api/burger/:name", async (req, res) => {
  let data = [];
  try {
    await mongoose.connect("mongodb://root:example@mongodb:27017/admin");
    console.log("Connected to db");
    const burger = await burgerModel.findOne(
      {name:req.params.name},
      { name: 1, popularity: 1, _id: 0 }
    );
    data.burger = burger;
    data.message = "burger found";
    data.status = "ok";
    response(data, 200, res);
  } catch (error) {
    data.message = error;
    data.status = "ko";
    data.burger = null;
    response(data, 500, res);
  } finally {
    await mongoose.connection.close();
    console.log("Disconnected to db");
  }
});

app.post("/api/create", verify, async (req, res, next) => {
  let data = [];
  try {
    await mongoose.connect("mongodb://root:example@mongodb:27017/admin");
    console.log("Connected to db");
    const burger = new burgerModel({
      name: req.body.name,
      popularity: req.body.popularity,
    });

    const savedBurger = await burger.save();
    data.burger = savedBurger;
    data.message = "Burger created";
    data.status = "ok";
    response(data, 201, res);
  } catch (error) {
    data.burger = null;
    data.message="error server";
    data.status = "ko"
    response(data, 500, res);
  } finally {
    await mongoose.connection.close();
    console.log("Disconnected to db");
  }
});

app.put("/api/update", async (req, res) => {
  let data = [];
  try {
    await mongoose.connect("mongodb://root:example@mongodb:27017/admin");
    console.log("Connected to db");
    const burger = await burgerModel.updateOne(
      { name: req.body.name },
      { popularity: req.body.popularity }
    );
    response(data, 204, res);
  } catch (error) {
    response(data, 500, res);
  } finally {
    await mongoose.connection.stop();
    console.log("Disconnected to db");
  }
});

app.delete("/api/delete/:name", verifyMime, async (req, res, next) => {
  let data = [];
  try {
    await mongoose.connect("mongodb://root:example@mongodb:27017/admin");
    console.log("Connected to db");
    const burger = await burgerModel.deleteOne({ name: req.params.name });
    response(data, 204, res);
  } catch (error) {
    data.message = error;
    data.status = "ko";
    data.burger = null;
    response(data, 500, res);
  } finally {
    await mongoose.connection.close();
    console.log("Disconnected to db");
  }
});

app.listen(port, () => {
  console.log("serveur lancé sur http://0.0.0.0:3000/");
});
