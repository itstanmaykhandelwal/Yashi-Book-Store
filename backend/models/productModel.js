const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter Book Name"],
        trim:true
    },
    description:{
        type:String,
        required:[true,"Please Enter Book Description"]
    },
    price:{
        type:Number,
        required:[true,"Please Enter Book Price"]
    },
    dPrice:{
        type:Number,
        required:[true,"Please Enter Discount Price"],
        maxLength:[8,"Price cannot be exceed 8 digits"]
    },
    rating:{
        type:Number,
        default:0
    },
    images:[
        {
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
        }
    ],
    category: {
        type: String,
        required: [true, "Please Enter Product Category"],
    },
    board:{
        type:String,
        required:[true,"Please Enter Board Name"]
    },
    class:{
        type:Number,
        required:[true,"Please Enter Class Name"]
    },
    sub:{
        type:String,
        required:[true,"Please Enter Subject Name"]
    },
    author:{
        type:String,
        required:[true,"Please Enter Board Name"]
    },
    board:{
        type:String,
        required:[true,"Please Enter Author Name"]
    },
    // numOfReview:{
    //     type:Number,
    //     default:0
    // },
    // reviews:[
    //     {
    //         name:{
    //             type:String,
    //             required:true
    //         },
    //         rating:{
    //             type:Number,
    //             required:true
    //         },
    //         comment:{
    //             type:String
    //         }
    //     }
    // ],

    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model("Product",productSchema)