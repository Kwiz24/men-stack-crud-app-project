const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
    name: String,
    country: String, // Country of origin
    established: Number, // Year established
});

const Brand = mongoose.model("Brand", brandSchema);

module.exports = Brand;