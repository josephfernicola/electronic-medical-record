const express = require("express");
const {
  loginProvider,
  signupProvider,
  getProviderProfile,
  addProviderNote,
  getAllProviders,
  updateProviderNote,
  deleteProviderNote,
} = require("../controllers/providerControllers");

const requireAuth = require("../middleware/requireAuth")


const router = express.Router();


//sign up a new provider
router.post("/EMR/signup", signupProvider);

//login provider
router.post("/EMR/login", loginProvider);

//require auth for all routes besides logging in and signing up
router.use(requireAuth)

//GET all providers
router.get("/EMR/providers", getAllProviders);


//GET a single provider profile
router.get("/EMR/:id", getProviderProfile);

//GET a provider notes page
router.get("/EMR/notes/:id", (req, res) => {
  res.json({ mssg: "Get provider notes" });
});

//Add a note to provider 
router.patch("/:id", addProviderNote);

//update provider note
router.patch("/providers/editNote/:id", updateProviderNote)

//delete Provider Note
router.patch("/providers/deleteProviderNote/:id", deleteProviderNote)


module.exports = router;
