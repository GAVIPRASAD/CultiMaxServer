const ContactForm = require("../models/ContactModel");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

exports.submitContactForm = catchAsyncErrors(async(req,res,next)=>{
    const {name,email,message} = req.body;

    const form = await ContactForm.create({
        name,email,message
    })
    res.status(201).json({
    success: true,
    email,
  });
})