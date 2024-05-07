const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");

const app = express();

const Sneaker = require("./models/sneaker.js");

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use(express.static('public'));

// Display data on multiple pages route for sneaker list
app.get("/sneakers", async (req, res) => {
  const perPage = 10;
  const page = req.query.page || 1;

  try {
      const allSneakers = await Sneaker.find()
          .skip((perPage * page) - perPage)
          .limit(perPage)
          .exec();

      const count = await Sneaker.countDocuments();
      const totalPages = Math.ceil(count / perPage);

      res.render("index.ejs", {
          sneakers: allSneakers,
          current: page,
          pages: totalPages
      });
  } catch (err) {
      console.error("Error:", err);
      res.redirect("/");
  }
});

// Index route
app.get("/", async (req, res) => {
  try {
      const allSneakers = await Sneaker.find();
      res.render("index.ejs", {
          sneakers: allSneakers,
      });
  } catch (err) {
      console.error("Error:", err);
      res.status(500).send("Internal Server Error");
  }
});

// Sorting route for sneaker list
app.get("/sneakers/sort/:criteria", async (req, res) => {
  const criteria = req.params.criteria;
  let sneakers;

  try {
      if (criteria === "name") {
          sneakers = await Sneaker.find().sort({ name: 1 });
      } else if (criteria === "size") {
          sneakers = await Sneaker.find().sort({ size: 1 });
      } else if (criteria === "color") {
          sneakers = await Sneaker.find().sort({ color: 1 });
      }

      res.render("index.ejs", { sneakers: sneakers });
  } catch (err) {
      console.error("Error:", err);
      res.redirect("/sneakers");
  }
});

// Search route for sneakers
app.get("/sneakers/search", async (req, res) => {
  const query = req.query.q;

  try {
      const searchResults = await Sneaker.find({ name: { $regex: new RegExp(query, "i") } });

      res.render("index.ejs", { sneakers: searchResults });
  } catch (err) {
      console.error("Error:", err);
      res.redirect("/sneakers");
  }
});

// Search route for sneakers
app.get("/sneakers/search", async (req, res) => {
    const query = req.query.q;

    try {
        const searchResults = await Sneaker.find({ name: { $regex: new RegExp(query, "i") } });

        res.render("index.ejs", { sneakers: searchResults });
    } catch (err) {
        console.error("Error:", err);
        res.redirect("/sneakers");
    }
});

// Route to create a new sneaker
app.get("/sneakers/new", (req, res) => {
    res.render("sneakers/new.ejs");
});

app.post("/sneakers", async (req, res) => {
    console.log(req.body);
    if (req.body.isReadyToView === "on") {
        req.body.isReadyToView = true;
    } else {
        req.body.isReadyToView = false;
    }
    const createdSneaker = await Sneaker.create(req.body);
    res.redirect('/sneakers');
});

// Route to view a specific sneaker
app.get("/sneakers/:sneakerId", async (req, res) => {
    const foundSneaker = await Sneaker.findById(req.params.sneakerId);
    res.render("sneakers/show.ejs", { sneaker: foundSneaker });
});

// Route to delete a specific sneaker
app.delete("/sneakers/:sneakerId", async (req, res) => {
    await Sneaker.findByIdAndDelete(req.params.sneakerId);
    res.redirect("/sneakers");
});

// Route to edit a specific sneaker
app.get("/sneakers/:sneakerId/edit", async (req, res) => {
    const foundSneaker = await Sneaker.findById(req.params.sneakerId);
    res.render("sneakers/edit.ejs", { sneaker: foundSneaker });
});

app.put("/sneakers/:sneakerId", async (req, res) => {
  try {
      const { sneakerId } = req.params;
      const updateData = req.body;

      // Handle the 'isReadyToView' checkbox data
      if (updateData.isReadyToView === "on") {
          updateData.isReadyToView = true;
      } else {
          updateData.isReadyToView = false;
      }

      // Update the sneaker in the database
      const updatedSneaker = await Sneaker.findByIdAndUpdate(sneakerId, updateData, { new: true });

      if (!updatedSneaker) {
          return res.status(404).send("Sneaker not found");
      }

      // Redirect to the sneakers's show page to see the updates
      res.redirect(`/sneakers/${sneakerId}`);
  } catch (err) {
      console.error("Error:", err);
      res.status(500).send("Internal Server Error");
  }
});

// Route to delete a specific sneaker
app.get("/sneakers/:sneakerId/delete", async (req, res) => {
    const foundSneaker = await Sneaker.findById(req.params.sneakerId);
    res.render("sneakers/delete.ejs", { sneaker: foundSneaker });
});

app.listen(3002, () => {
  console.log("Listening on port 3002");
});

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
  });