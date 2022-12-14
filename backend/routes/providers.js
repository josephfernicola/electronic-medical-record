const express = require("express");
const {
  loginProvider,
  loginGuest,
  signupProvider,
  getProviderProfile,
  addProviderNote,
  getAllProviders,
  updateProviderNote,
  deleteProviderNote,
  deleteProvider

} = require("../controllers/providerControllers");

const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

//sign up a new provider
router.post("/EMR/signup", signupProvider);

//login provider
router.post("/EMR/login", loginProvider);

//login guest
router.post("/EMR/loginGuest", loginGuest);

//require auth for all routes besides logging in and signing up
router.use(requireAuth);

//GET all providers
router.get("/EMR/providers", getAllProviders);

//GET a single provider profile
router.get("/EMR/:id", getProviderProfile);

//Add a note to provider 
router.patch("/:id", addProviderNote);

//update provider note
router.patch("/providers/editNote/:id", updateProviderNote);

//delete Provider Note
router.patch("/providers/deleteProviderNote/:id", deleteProviderNote);

//delete provider account
router.patch("/providers/deleteProviderAccount", deleteProvider);

module.exports = router;