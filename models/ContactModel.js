const mongoose = require("mongoose");
const validator = require("validator");
const contactFormSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Enter your Name"],
    minlength: [3, "Please enter a name atleast 3 characters"],
    maxlength: [20, "Name can not big than 20 characters"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    validate: [validator.isEmail, "Please enter a valid email"],
    unique: true,
  },
  message: {
    type: String,
    required: [true, "Please enter message"]
  },
});

module.exports = mongoose.model("ContactForm",contactFormSchema);