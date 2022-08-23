const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const Schema = mongoose.Schema;

const providerSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },

    credentials: {
      type: String,
      required: true,
    },
    specialty: {
      type: String,
      required: false,
    },
    photo: {
      type: String,
      required: false,
    },
    notes: {
      type: Array,
      required: false,
    },
  },
  { timestamps: true }
);

//static signup method
providerSchema.statics.signup = async function (
  email,
  password,
  firstName,
  lastName,
  credentials,
  specialty,
  photo,
  notes
) {
  const emailExists = await this.findOne({ email });
  //validation
  if (!email || !password) {
    throw Error("All fields must be filled");
  }
  if (!validator.isEmail(email)) {
    throw Error("Email is not valid");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error(
      "Password not strong enough. Must be at least 8 characters, include one uppercase and lowercase letter, and special character."
    );
  }

  if (emailExists) {
    throw Error("Email already in use");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const provider = await this.create({
    email,
    password: hash,
    firstName,
    lastName,
    credentials,
    specialty,
    photo,
    notes,
  });

  return provider;
};

//static login method
providerSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields must be filled");
  }

  const provider = await this.findOne({ email });

  if (!provider) {
    throw Error("Incorrect email");
  }
  const match = await bcrypt.compare(password, provider.password);
  if (!match) {
    throw Error("Incorrect password");
  }
  return provider;
};

module.exports = mongoose.model("Provider", providerSchema);
