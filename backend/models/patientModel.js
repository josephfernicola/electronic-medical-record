const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const patientSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  pmh: {
    type: Array,
    required: true,
  },
  notes: {
    type: Array,
    required: false,
  },
  age: {
    type: Number,
    required: true,
  },
  allergies: {
    type: Array,
    required: true,
  }
});

//static signup method
patientSchema.statics.signup = async function (name, pmh, notes, age, allergies) {
    const exists = await this.findOne({name})
    if (exists) {
        throw Error('Patient already in Database')
    }
  const patient = await this.create({ name, pmh, notes, age, allergies });
  return patient;
};

module.exports = mongoose.model("Patient", patientSchema);
