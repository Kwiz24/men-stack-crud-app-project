const mongoose = require("mongoose");

const sneakerSchema = new mongoose.Schema({
    name: String,
    color: String,
    size: Number,
    isReadyToView: Boolean,
});

const Sneaker = mongoose.model("Sneaker", sneakerSchema);

module.exports = Sneaker;