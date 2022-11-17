require("dotenv").config();
const Provider = require("../models/providerModel");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

//get all providers on EMR
const getAllProviders = async (req, res) => {
  const providers = await Provider.find({}).sort({ createdAt: -1 });
  res.status(200).json(providers);
};

//login provider
const loginProvider = async (req, res) => {
  const { email, password } = req.body;
  try {
    const provider = await Provider.login(email, password);

    const token = createToken(provider._id);

    res.status(200).json({ provider, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const loginGuest = async = (req, res) => {
  const guest = req.body;
  const guestInfo = guest.guestInfo
  try {

    const token = createToken(uuidv4);

    res.status(200).json({ guestInfo, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

//sign up provider
const signupProvider = async (req, res) => {
  const {
    email,
    password,
    firstName,
    lastName,
    credentials,
    specialty,
    photo,
    notes,
  } = req.body;

  //add doc to db
  try {
    const provider = await Provider.signup(
      email,
      password,
      firstName,
      lastName,
      credentials,
      specialty,
      photo,
      notes
    );
    const token = createToken(provider._id);
    res.status(200).json({ provider, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//get single user profile
const getProviderProfile = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such profile" });
  }

  const provider = await Provider.findById(id);
  if (!provider) {
    return res.status(404).json({ error: "No such profile" });
  }
  res.status(200).json(provider);
};

//add provider note
const addProviderNote = async (req, res) => {
  const { id } = req.params;
  const {
    subjective,
    objective,
    assessment,
    plan,
    providerFirstName,
    providerLastName,
    credentials,
    patientName,
    noteID,
    date,
    time,
  } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Not valid id" });
  }

  const provider = await Provider.findOneAndUpdate(
    { _id: id },
    {
      $push: {
        notes: {
          subjective: subjective,
          objective: objective,
          assessment: assessment,
          plan: plan,
          provider: `${providerFirstName} ${providerLastName}`,
          credentials: credentials,
          patient: patientName,
          noteID: noteID,
          date: date,
          time: time,
        },
      },
    }
  );
  if (!provider) {
    return res.status(404).json({ error: "No such provider" });
  }
  res.status(200).json(provider);
};

const updateProviderNote = async (req, res) => {
  const { id } = req.params;
  const { subjective, objective, assessment, plan, date, noteID, time } =
    req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "not valid id" });
  }

  const providerNote = await Provider.updateOne(
    { "notes.noteID": noteID },
    {
      $set: {
        "notes.$.subjective": subjective,
        "notes.$.objective": objective,
        "notes.$.assessment": assessment,
        "notes.$.plan": plan,
        "notes.$.date": date,
        "notes.$.time": time,
      },
    }
  );

  if (!providerNote) {
    return res.status(404).json({ error: "No such provider" });
  }
  return res.status(200).json(providerNote);
};

const deleteProviderNote = async (req, res) => {
  const { id } = req.params;
  const { noteID } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "not valid id" });
  }

  const note = await Provider.updateOne(
    { _id: id },
    { $pull: { notes: { noteID: noteID } } }
  );

  return res.status(200).json(note);
};

module.exports = {
  getProviderProfile,
  addProviderNote,
  getAllProviders,
  loginProvider,
  loginGuest,
  signupProvider,
  updateProviderNote,
  deleteProviderNote,
};
