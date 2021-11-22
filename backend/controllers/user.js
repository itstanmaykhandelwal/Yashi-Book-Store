const ErrorHandler = require("../utils/errorhander");
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/userModel")
const sendToken = require("../utils/jwtToken")
const sendEmail = require("../utils/sendEmail.js")
const crypto = require("crypto")

// Register a user
exports.registerUser = catchAsyncError(async(req,res,next)=>{
    const { name, email, password,phone } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        phone,
        avatar:{
            public_id:"sample id",
            url:"dpUrl"
        }
    })

    sendToken(user,201,res);
})


// Login User

exports.loginUser = catchAsyncError (async (req,res,next) =>{
    const {email,password} = req.body;

    // checking if user has given password and email both

    if(!email || !password){
        return next(new ErrorHandler("Please Enter Email & Password",400))
    }
    const user = await User.findOne({email}).select("+password");

    if(!user){
        return next(new ErrorHandler("Invalid Email or Password",401))
    }

    const isPasswordMatched = user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Email or Password",401))
    }
    sendToken(user,200,res);
})

// Logout User
exports.logout = catchAsyncError(async(req,res,next)=>{

    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true,
    })

    res.status(200).json({
        success:true,
        message:"Logged Out"
    })
})

// Forgot Password 
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
    
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
    // Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });
  
    const resetPasswordUrl = `${req.protocol}://${req.get(
      "host"
    )}/password/reset/${resetToken}`;
  
    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

    try {
        await sendEmail({
          email: user.email,
          subject: `Ecommerce Password Recovery`,
          message,
        });
    
        res.status(200).json({
          success: true,
          message: `Email sent to ${user.email} successfully`,
        });
      } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
    
        await user.save({ validateBeforeSave: false });
    
        return next(new ErrorHandler(error.message, 500));
    }
});

// Reset Password
exports.resetPassword = catchAsyncError(async (req, res, next) => {

    // creating token hash
    const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex")

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt: Date.now() },
    })
    if (!user) {
        return next(new ErrorHandler("Reset Password Token is invalid ot has been Expired", 404));
    }
    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Password does not match", 404));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user,200,res);
})

// Get User Details

exports.getUserDetails = catchAsyncError(async(req,res,next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success:true,
        user,
    })
})

// Get User Password

exports.updatePassword = catchAsyncError(async(req,res,next) => {
    const user = await User.findById(req.user.id).select("+password")

    const isPasswordMatched = user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Old Password is incorrect",401))
    } 

    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler("Password does not match",401))
    }

    user.password = req.body.newPassword;

    await user.save()

    sendToken(user,200,res)
})

// Update User Profile

exports.updateProfile = catchAsyncError(async(req,res,next) => {
   
    const newUserData={
        name:req.body.name,
        email:req.body.email,
    }

    // We will add cloudinary later

    const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    });

    res.status(200).json({
        success:true,
    })
})

// Get All User (admin)
exports.getAllUser = catchAsyncError(async(req,res,next) => {
    
    const users = await User.find()
    res.status(200).json({
        success:true,
        users,
    })
})

// Get Single User (admin)
exports.getSingleUser = catchAsyncError(async(req,res,next) => {
    
    const user = await User.findById(req.params.id)

    if(!user){
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`))
    }
    res.status(200).json({
        success:true,
        user,
    })
})

// Update User Role (admin)

exports.updateUserRole = catchAsyncError(async(req,res,next) => {
   
    const newUserData={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role,
    }
    if(!User){
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`))
    }

    await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      });

    res.status(200).json({
        success:true,
    })
})


// Delete User Profile (admin)

exports.deleteUser = catchAsyncError(async(req,res,next) => {
   
const user = await User.findById(req.params.id)
    // We will remove cloudinary later
    if(!user){
        return next(new ErrorHandler(`User does not exit with Id: ${req.params.id}`))
    }

    await user.remove();

    res.status(200).json({
        success:true,
        message:"User Deleted Successfully",
    })
})

// 