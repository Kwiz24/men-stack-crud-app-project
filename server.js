const express = require ("express");
const app  = express();

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
  });

const dotenv = require("dotenv");
dotenv.donfi();

app.listen(3002, () => {
    console.log("Listening on port 3002");
});

