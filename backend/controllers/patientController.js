const Patient = require("../models/patientModel");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const uploadPatientData = async (req, res) => {
  const { name, pmh, notes, age, allergies } = req.body;

  try {
    const patient = await Patient.signup(name, pmh, notes, age, allergies);
    res.status(200).json({ name, patient });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
//get all patients on EMR
const getAllPatients = async (req, res) => {
  const patients = await Patient.find({}).sort({ createdAt: -1 });
  res.status(200).json(patients);
};

//add note for a patient
const addPatientNote = async (req, res) => {
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

  const patient = await Patient.findOneAndUpdate(
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
  if (!patient) {
    return res.status(404).json({ error: "No such patient" });
  }
  res.status(200).json(patient);
};

const updatePatientNote = async (req, res) => {
  const { id } = req.params;
  const { subjective, objective, assessment, plan, date, noteID, time } =
    req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "not valid id" });
  }

  const patientNote = await Patient.updateOne(
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

  if (!patientNote) {
    return res.status(404).json({ error: "No such patient" });
  }
  return res.status(200).json(patientNote);
};

const deletePatientNote = async (req, res) => {
  const { id } = req.params;
  const { noteID } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "not valid id" });
  }

  const note = await Patient.findByIdAndUpdate(id, {
    $pull: { notes: { noteID: noteID } },
  });

  if (!note) {
    return res.status(400).json({ error: "No such note" });
  }
  return res.status(200).json(note);
};

module.exports = {
  uploadPatientData,
  getAllPatients,
  addPatientNote,
  updatePatientNote,
  deletePatientNote,
};
