const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose")
const methodOverride = require("method-override");
const morgan = require("morgan");

const app = express();

const Sneaker = require("./models/sneaker.js");

  app.use(express.urlencoded({ extended: false }));
  app.use(methodOverride("_method"));
  app.use(morgan("dev"));

  app.use(express.static('public'));

  app.get("/", async (req, res) => {
    res.render("index.ejs");
  });

  app.get("/sneakers", async (req, res) => {
      const allSneakers = await Sneaker.find();
      res.render("index.ejs", {sneakers: allSneakers});
  });

  app.post("/sneakers", async (req, res) => {
    console.log(req.body);
    if(req.body.isReadyToView === "on"){
        req.body.isReadyToView = true
    }else {
       req.body.isReadyToView = false
    }
    const createdSneaker = await Sneaker.create(req.body);
      res.redirect('/sneakers');
  });

  app.get("/sneakers/new" , (req, res) => {
    res.render("sneakers/new.ejs");
  });

    app.get("/sneakers/:sneakertId", async (req, res) => {
    const foundSneaker = await Sneaker.findById(req.params.sneakerId);
    res.render("sneakers/show.ejs", { sneaker: foundSneaker });
  });

  app.delete("/sneakers/:sneakerId", async (req, res) => {
    await Sneaker.findByIdAndDelete(req.params.carId);
    res.redirect("/sneaker");
  });

  app.get("/sneakers/:sneakerId/edit", async (req, res) => {
    const foundSneaker = await Sneaker.findById(req.params.sneakerId);
    res.render("sneakers/edit.ejs", {
    sneaker: foundSneaker,
    });
  });

  app.put("/sneakers/:sneakerId", async (req, res) => {
    // Handle the 'isReadyToView' checkbox data
    if (req.body.isReadyToView === "on") {
      req.body.isReadyToView = true;
    } else {
      req.body.isReadyToView = false;
    }
    
    // Update the sneaker in the database
    await sneaker.findByIdAndUpdate(req.params.sneakerId, req.body);
  
    // Redirect to the planet's show page to see the updates
    res.redirect(`/sneakers/${req.params.sneakerId}`);
  });

app.listen(3002, () => {
  console.log("Listening on port 3002");
});

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
  });