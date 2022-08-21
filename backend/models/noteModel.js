const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const noteSchema = new Schema({
  provider: {
    type: String,
    required: true,
  },
  patient: {
    type: String,
    required: true,
  },

  subjective: {
    type: String,
    required: true,
  },
  objective: {
    type: String,
    required: true,
  },
  assessment: {
    type: String,
    required: true,
  },
  plan: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

//static signup method
noteSchema.statics.signup = async function (
  provider,
  patient,
  subjective,
  objective,
  assessment,
  plan,
  date
) {
  const note = await this.create({
    provider,
    patient,
    subjective,
    objective,
    assessment,
    plan,
    date,
  });
  return note;
};

module.exports = mongoose.model("Notes", noteSchema);
