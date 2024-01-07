const mongoose = require('mongoose');

  const burgerSchema = new mongoose.Schema({
    name:{
      "type": String,
      "required":true,
    },
      popularity:{
      "type":Number,
      "required":true,
    },
    createdAt:{
      "type":Date,
      "default":Date.now()
    },
  });

  const burgerModel = mongoose.model('Burger',burgerSchema);

  module.exports = burgerModel;


