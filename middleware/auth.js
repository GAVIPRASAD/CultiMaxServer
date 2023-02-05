const ErrorHandler = require("../utils/ErrorHandle");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const catchAsyncErrors = require("./catchAsyncErrors");

exports.isAuthenticatedUser = catchAsyncErrors(async(req,res,next)=>{
    const {token} = req.cookies;
    if(!token){
        return next(new ErrorHandler("Login For Accessing Resources",401));
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decodedData.id);
    next();

})

//admin roles
exports.authorizeRoles = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
          return next(new ErrorHandler(`${req.user.role} can not access this resource`))  
        }
        next()
    }
}
exports.authorizeCaptain = (...captain)=>{
    return (req,res,next)=>{
        if(!captain.includes(req.user.captain)){
          return next(new ErrorHandler(`${req.user.captain} can not access this resource`))  
        }
        next()
    }
}