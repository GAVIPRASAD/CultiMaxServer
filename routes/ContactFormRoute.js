const express = require("express");
const {submitContactForm} = require("../controller/ContactFormController");

const router = express.Router();

router.route("/contact/new").post(submitContactForm);

module.exports = router;