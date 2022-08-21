require("dotenv").config();

const express = require("express");
const providerRoutes = require("./routes/providers");
const patientRoutes = require("./routes/patient");
const mongoose = require("mongoose");

//express app
const app = express();


//middleware
app.use(express.json());

// app.use((req, res, next) => {
//   console.log(req.path, req.method);
//   next();
// });

const path = require('path')

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../frontend/build')))

//routes
// app.get('/', function (req, res) {
//   res.send('Home');
// });

app.use("/api/patients/", patientRoutes);
app.use("/api/", providerRoutes);

// AFTER defining routes: Anything that doesn't match what's above, send back index.html; (the beginning slash ('/') in the string is important!)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/../frontend/build/index.html'))
})

const PORT = process.env.PORT || 5000;
//connect to db
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => {
    //listen for requests
    app.listen(PORT, function () {
      console.log("Connect to db and listening on:", PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });
