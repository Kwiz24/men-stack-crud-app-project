const mongoose = require("mongoose");

const sneakerSchema = new mongoose.Schema({
    name: String,
    isReadyToView: Boolean,
});

const Sneaker = mongoose.model("Sneaker", sneakerSchema);

module.exports = Sneaker;