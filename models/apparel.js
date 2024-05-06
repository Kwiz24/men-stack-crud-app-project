const mongoose = require("mongoose");

const apparelSchema = new mongoose.Schema({
    name: String,
    type: String, // e.g., shirt, pants, jacket, etc.
    color: String,
    size: String, // Could be S, M, L, XL, etc.
});

const Apparel = mongoose.model("Apparel", apparelSchema);

module.exports = Apparel;