const express = require("express");
const mongoose = require("mongoose");
const burgerModel = require("../models/burger_model");
const app = express();
const port = 3000;

function verifyMime(req, res, next) {
  if (req.is("html") == true) {
    next();
  } else {
    res.status(400).send("Bad request");
  }
}

function verifyBody(req, res, next) {
  if (req.body.name != "") {
    if (req.body.popularity > 3 && req.body.popularity < 0) {
      next();
    } else {
      res
        .status(400)
        .send("the field popularity is required and respect the format");
    }
  } else {
    res.status(400).send("the field name is required and respect the format");
  }
}

const verify = [verifyBody, verifyMime];

app.get("/burgers", verifyMime, async (req, res, next) => {
  try {
    await mongoose.connect("mongodb://root:example@mongodb:27017/admin");
    console.log("Connected to db");
    const burgers = await burgerModel.find(
      {},
      { name: 1, popularity: 1, _id: 0 }
    );
    const response = [
      {
        data: burgers,
      },
      {
        status: "ok",
      },
    ];
    res.status(200);
    res.json(response);
  } catch (error) {
    const response = [
      {
        message: "burgers not found",
      },
      {
        status: "ko",
      },
    ];
    res.json(response);
    console.error("burgers not found", error);
  } finally {
    await mongoose.connection.close();
    console.log("Disconnected to db");
  }
});

app.post("/create", verify, async (req, res, next) => {
  try {
    await mongoose.connect("mongodb://root:example@mongodb:27017/admin");
    console.log("Connected to db");

    const burger = new burgerModel({
      name: req.body.name,
      popularity: req.body.popularity,
    });

    const savedBurger = await burger.save();
    console.log("Burger created :", savedBurger);

    const response = [
      {
        data: savedBurger,
      },
      {
        message: "Burger created",
      },
      {
        status: "ok",
      },
    ];
    res.status(201);
    res.json(response);
  } catch (error) {
    console.error("error", error);
    res.status(500).send("error server");
  } finally {
    await mongoose.connection.close();
    console.log("Disconnected to db");
  }
});

app.put("/update", verify, async (req, res, next) => {
  try {
    await mongoose.connect("mongodb://root:example@mongodb:27017/admin");
    console.log("Connected to db");
    const burger = await burgerModel.updateOne(
      { name: req.body.name },
      { popularity: req.body.popularity }
    );
    console.log("Burger updated :", burger);

    const response = [
      {
        data: burger,
      },
      {
        message: "Burger updated",
      },
      {
        status: "ok",
      },
    ];

    res.status(200);
    res.json(response);
  } catch (error) {
    console.error("error", error);
    res.status(500).send("error server");
  } finally {
    await mongoose.connection.stop();
    console.log("Disconnected to db");
  }
});

app.delete("/delete", verifyMime, async (req, res, next) => {
  try {
    await mongoose.connect("mongodb://root:example@mongodb:27017/admin");
    res.status(200);
  } catch (error) {
  } finally {
    await mongoose.connection.close();
    console.log("Disconnected to db");
  }
});

app.listen(port, () => {
  console.log("serveur lancé sur http://0.0.0.0:3000/");
});
