const ErrorHandler = require("../utils/ErrorHandle");

module.exports = (err,req,res,next)=>{
    err.statusCode = err.statusCode||500
    err.message = err.message || "Internal Server Error"

    // Mongodb cast error
    if(err.name === "CastError"){
        const message = `Resources not found with this id..Invalid${err.path}`;
        err=new ErrorHandler(message,404)
    }

    //duplicate key error
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message,400);
    }
    //wrong jwt  key error
    if(err.name === "TokenExpiredError"){
        const message = `Your Url Is Expired`;
        err = new ErrorHandler(message,400);
    }
    //expired jwt  key error
    if(err.name === "jsonWebTokenError"){
        const message = `Your Url Is invalid/Expired try again`;
        err = new ErrorHandler(message,400);
    }
    res.status(err.statusCode).json({
        success:false,
        // message:err.stack
        message:err.message
    })
}

