require("dotenv").config();

const express = require("express");
const providerRoutes = require("./routes/providers");
const patientRoutes = require("./routes/patient");
const mongoose = require("mongoose");

//express app
const app = express();

//middleware
app.use(express.json());

const path = require("path");

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, "../frontend/build")));

app.use("/api/patients/", patientRoutes);
app.use("/api/", providerRoutes);

const PORT = process.env.PORT || 5000;
//connect to db
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => {
    //listen for requests
    app.listen(PORT, function () {
      console.log("Connected to db and listening on:", PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });
