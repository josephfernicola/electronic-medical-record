const express = require('express');

const requireAuth = require("../middleware/requireAuth")
//controller function
const {uploadPatientData, getAllPatients, addPatientNote, updatePatientNote, deletePatientNote, deleteMultiplePatientNotes} = require('../controllers/patientController')

const router = express.Router();
router.use(requireAuth)

// post patients route
router.post('/uploadPatients', uploadPatientData)

//get all patients route
router.get('/getPatients', getAllPatients)

//Add a note for patient
router.patch("/note/:id", addPatientNote);

//Update patient note
router.patch("/editNote/:id", updatePatientNote);

//Delete Patient Note
router.patch("/deletePatientNote/:id", deletePatientNote);

router.patch("/deleteMultiplePatientNotes", deleteMultiplePatientNotes);


module.exports = router