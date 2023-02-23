const User = require("../models/UserModel");
const ErrorHandler = require("../utils/ErrorHandle");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
// const SendmailTransport = require("nodemailer/lib/sendmail-transport");
const sendMail = require("../utils/sendMail")
const crypto = require("crypto")

//Register User
exports.createUser = catchAsyncErrors(async(req,res,next) =>{
    const {name,email,password} = req.body;
    // console.log(req.body)

    const user = await User.create({
        name,email,password,
        avatar:{
            public_id:"test.com",
            url:"test.com"
        }
    })
    sendToken(user,201,res);
});


//Login
 exports.loginUser = catchAsyncErrors(async(req,res,next)=>{
    const {email,password} = req.body;
    if(!email || !password){
        return next(new ErrorHandler("Please Enter Valid Details",400));
    }
    const user = await User.findOne({ email }).select("+password");
    if(!user){
        return next(new ErrorHandler("No user exists with this id",401))
    }

    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Password",401))
    }
    // console.log("Loogggg")   
   sendToken(user,201,res);
 })


 //LogOut

 exports.logoutUser = catchAsyncErrors(async(req,res,next)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true,
    })
    res.status(200).json({
        success:true,
        message:"Logout successfullly"
    })
 })


 //forgot pass
 exports.forgotPassword= catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findOne({email:req.body.email})
    if(!user){
        return next(new ErrorHandler("User Not Exists",404))
    }
    const resetToken = user.getResetToken();
    await user.save({
        validateBeforeSave:false
    })

    // const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`
    const resetPasswordUrl = `${req.protocol}://localhost:3000/password/reset/${resetToken}`
    const message = `Your Password reset token is:\n\n${resetPasswordUrl}`;

    try {
        await sendMail({
            email:user.email,
            subject:`CultiMax Password Recovery`,
            message
        })
        res.status(200).json({
            success:true,
            message:`Email sent Successfully to ${user.email}`
        })
    } catch (error) {
        user.resetPasswordToken= undefined;
        user.resetPasswordTime= undefined;

        await user.save({
            validateBeforeSave:false,
        })
        return next(new ErrorHandler(error.message))
    }
 })


 //resetting pass
 exports.resetPassword = catchAsyncErrors(async(req,res,next)=>{
    //creating token hash
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordTime:{$gt:Date.now()},

    });

    if(!user){
        return next(new ErrorHandler("Reset Password Url is not valid or has been expired",400));
    }
    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Enter same Password as you entered above",400));
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordTime = undefined;

    await user.save();
    sendToken(user,200,res);
 })


 // details of user
 exports.userDetails = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success:true,
        user
    })
 });


 //update password
 exports.updatePassword = catchAsyncErrors(async(req,res,next)=>{
     const user = await User.findById(req.user.id).select("+password");
     const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
     if(!isPasswordMatched){
         return next(new ErrorHandler("Old Password is incorrect",400))
        };
        
        if(req.body.newPassword !== req.body.confirmPassword){
         return next(new ErrorHandler("Enter same Passwords in the both fields",400));
        
     }

     user.password = req.body.newPassword
     await user.save();
     sendToken(user,200,res);
 });


 //update user profile
 exports.updateProfile = catchAsyncErrors(async(req,res,next)=>{
    const newUserData = {
        name:req.body.name,
        email:req.body.email
    }
    //cloudinary part 
    // console.log(newUserData);
    const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });
    res.status(200).json({
        success:true
    })
 })


 //Get All Users

exports.getAllUsers =catchAsyncErrors(async(req,res,next)=>{
    const users = await User.find();
    res.status(200).json({
        success:true,
        users
    })
});

//get Single User details by admin
exports.getSingleUser =catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler("No user Exists with this id",400))
    }
    res.status(200).json({
        success:true,
        user
    })
});


//Change roles
exports.updateUserRole = catchAsyncErrors(async(req,res,next)=>{
    const newUserData = {
        name:req.body.name,
        email:req.body.email,
        role:req.body.role,

    }
    //cloudinary part 
    const user = await User.findByIdAndUpdate(req.params.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });
    res.status(200).json({
        success:true
    })
 });

 //delete user by captain only
exports.deleteUser = catchAsyncErrors(async(req,res,next)=>{  
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler("No user Exists with this id",400))
    }
    await user.remove();
    res.status(200).json({
        success:true,
        message:"User Deleted successfully"
    })
 })