
const Products = require("../models/ProductsModel")
const ErrorHandler = require("../utils/ErrorHandle");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Features = require("../utils/Features");
// const Features = require("../utils/Features")
//Create Product 
exports.createProducts = catchAsyncErrors (async(req,res,next)=>{
    const products = await Products.create(req.body);
    res.status(201).json({
        success:true,
        products
    })
});

//retrieve
exports.getAllProducts = catchAsyncErrors( async (req,res)=>{
    const resultPerPage = 8;
    const productCount = await Products.countDocuments();
    const feature = new Features(Products.find(), req.query).search().filter().pagination(resultPerPage);
    const products = await feature.query;
    res.status(200).json({
        success:true,
        products,
    })
}
)
//update products
exports.updateProducts = catchAsyncErrors( async(req,res,next)=>{
    let products = await Products.findById(req.params.id);
    if(!products){
        return next(new ErrorHandler("Product Not Found",404));
        }
    products = await Products.findByIdAndUpdate(req.params.id, req.body,{
        new  : true,
        runValidators: true,
        useUnified :false
    })
    res.status(200).json({
        success:true,
        products
    })
}
)

//Delete Products 
exports.deleteProducts = catchAsyncErrors( async(req,res,next)=>{
    const products = await Products.findById(req.params.id);
    if(!products){
        return next(new ErrorHandler("Product Not Found",404));
        }
    

    await products.remove();
    res.status(200).json({
        success:true,
        message:"Successsfully Deleted the Product"
    })
}
)

//Single Product
exports.getSingleProducts = catchAsyncErrors( async(req,res,next)=>{
    const products = await Products.findById(req.params.id);
    if(!products){
        return next(new ErrorHandler("Product Not Found",404));
    }
    res.status(200).json({
        success:true,
        products,
    })
});

//review and update review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
    const { rating, comment, productId } = req.body;
  
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };
  
    const product = await Products.findById(productId);
  
    const isReviewed = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );
  
    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === req.user._id.toString())
          (rev.rating = rating), (rev.comment = comment);
      });
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }
  
    let avg = 0;
  
    product.reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    product.ratings = avg / product.reviews.length;
  
    await product.save({ validateBeforeSave: false });
  
    res.status(200).json({
      success: true,
    });
  });

  //get all reviews of product 
  exports.getSingleProductReviews = catchAsyncErrors(async(req,res,next)=>{
    const product = await Products.findById(req.query.id);
    if(!product){
        return next(new ErrorHandler("Product Not Found",404));
    }
    res.status(200).json({
        success:true,
        reviews:product.reviews
    })
  })

  //delete review admin
  exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
    const product = await Products.findById(req.query.productId);
  
    if (!product) {
      return next(new ErrorHandler("Product not found with this id", 404));
    }
  
    const reviews = product.reviews.filter(
      (rev) => rev._id.toString() !== req.query.id.toString()
    );
  
    let avg = 0;
  
    reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    let ratings = 0;
  
    if (reviews.length === 0) {
      ratings = 0;
    } else {
      ratings = avg / reviews.length;
    }
  
    const numOfReviews = reviews.length;
  
    await Products.findByIdAndUpdate(
      req.query.productId,
      {
        reviews,
        ratings,
        numOfReviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
  
    res.status(200).json({
      success: true,
    });
  });