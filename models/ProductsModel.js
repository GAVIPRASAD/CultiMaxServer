const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter a name for product"],
    trim: true,
    maxlength: [20, "Should be Less than 20 chars"],
  },
  description: {
    type: String,
    required: [true, "Please Enter description for product"],
    trim: true,
    maxlength: [4000, "Enter below 4000 Characers"],
  },
  price: {
    type: Number,
    required: [true, "Please add a price  for product"],
    trim: true,
    maxlength: [40, "Enter Price "],
  },
  discount: {
    type: String,
    trim: true,
    maxlength: [4, "Enter Discount and it should not exceed price"],
  },
  color: {
    type: String,
  },
  ratings: {
    type: Number,
    default: 0,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category:{
    type:String,
    required:[true,"Must Enter Categroy"]
  },
  stock:{
    type:Number,
    required:[true,"Enter The Stock Present In the WareHouse"],
    maxlength: [3, "Stock Cannot Accessed above 1000"],
  },
  numOfReviews:{
    type:Number,
    default:0
  },
  reviews:[{
    user:{
        type: mongoose.Schema.ObjectId,
        ref:"User",
        // required:true,
    },
    name:{
        type:String,
        required:true,
    },
    rating:{
        type:Number,
        required:true
    },
    comment:{
        type:String
    },
    time:{
        type:Date,
        default:Date.now()
    }
  }],

  user:{
    type:mongoose.Schema.ObjectId,
    ref:"User",
    // required:true,
  },

  createdAt:{
    type:Date,
    default:Date.now()
}

});

module.exports = mongoose.model("Products",productsSchema)
