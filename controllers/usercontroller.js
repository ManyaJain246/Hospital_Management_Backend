import { catchasyncerror } from "../middlewares/catchasyncerror.js";
import ErrorHandler from "../middlewares/errormiddleware.js";
import { User } from "../models/userschema.js";
import {generateToken} from "../utils/jwt.js";
import cloudinary from "cloudinary";

export const patientregister=catchasyncerror(async(req, res, next)=>{
    const {
        firstname,
        lastname,
        email,
        phone,
        nic,
        dob,
        gender,
        password,
        role, 
    }=req.body;

    if(
        !firstname||
        !lastname||
        !email||
        !phone||
        !nic||
        !dob||
        !gender||
        !password||
        !role
    ){
        return next(new ErrorHandler("Please provide complete details", 400));
    }

    const isregistered=await User.findOne({email})
    if(isregistered){
        return next(new ErrorHandler("User already registered", 400));
    }

    const user=await User.create({
        firstname,
        lastname,
        email,
        phone,
        nic,
        dob,
        gender,
        password,
        role,
    })

    generateToken(user, "User Registered", 200, res)
});

export const login=catchasyncerror(async(req, res, next)=>{
    const {email, password, confirmpassword, role}=req.body;
    if(!email || !password || !confirmpassword || !role){
        return next(new ErrorHandler("please provide all details", 400));
    }

    if(password!=confirmpassword){
        return next(new ErrorHandler("please provide all details", 400));
    }

    const user=await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid email or password", 400));
    }

    const ispasswordmatched=await user.comparepassword(password);
    if(!ispasswordmatched){
        return next(new ErrorHandler("Invalid email or password", 400));
    }

    if(role!==user.role){
        return next(new ErrorHandler("role not found", 400));
    }

    generateToken(user, "User logged in successfully", 200, res)
});

export const addnewadmin=catchasyncerror(async(req, res, next)=>{
    const {
        firstname,
        lastname,
        email,
        phone,
        nic,
        dob,
        gender,
        password,
    }=req.body;

    if(
        !firstname||
        !lastname||
        !email||
        !phone||
        !nic||
        !dob||
        !gender||
        !password
    ){
        return next(new ErrorHandler("Please provide complete details", 400));
    }

    const isregistered=await User.findOne({email})
    if(isregistered){
        return next(new ErrorHandler(`${isregistered} Admin with this email already exists`));
    }

    const admin=await User.create({firstname,
        lastname,
        email,
        phone,
        nic,
        dob,
        gender,
        password,
        role:"Admin"
 })
 res.status(200).json({
    success:true,
    message:"New admin registered"
 })
});

export const getalldoctors=catchasyncerror(async(req, res, next)=>{
    const doctors=await User.find({role:"Doctor"});
    res.status(200).json({
        success:true,
        doctors
    })
});

export const getuserdetails=catchasyncerror(async(req, res, next)=>{
    const user=req.user;
    res.status(200).json({
        success:true,
        user
    })
});

export const adminlogout=catchasyncerror(async(req, res, next)=>{
    res.status(200).cookie("adminToken", "", {
        httpOnly:true,
        expires:new Date(Date.now()),
        secure:true,
        sameSite:"None"
    })
    .json({
        success:true,
        message:"Admin logged out successfully"
    })
})

export const patientlogout=catchasyncerror(async(req, res, next)=>{
    res.status(200).cookie("patientToken", "", {
        httpOnly:true,
        expires:new Date(Date.now()),
        secure:true,
        sameSite:"None"
    })
    .json({
        success:true,
        message:"Patient logged out successfully"
    })
});

export const addnewdoctor=catchasyncerror(async(req, res, next)=>{
    if(!req.files || Object.keys(req.files)===0){
        return next(new ErrorHandler("Doctor Avatar is required", 400))
    }

    const {docavatar}=req.files;
    const allowedformats=["image/png", "image/jpeg", "image/webp"];
    if(!allowedformats.includes(docavatar.mimetype)){
        return next(new ErrorHandler("file type is not supported", 400))
    }

    const {
        firstname,
        lastname,
        email,
        phone,
        nic,
        dob,
        gender,
        password,
        doctordepartment
    }=req.body;

    if(
        !firstname||
        !lastname||
        !email||
        !phone||
        !nic||
        !dob||
        !gender||
        !password||
        !doctordepartment||
        !docavatar
    ){
        return next(new ErrorHandler("Please provide all details", 400))
    }

    const isregistered=await User.findOne({email});
    if(isregistered){
        return next(new ErrorHandler("User already exists", 400))
    }

    const cloudinaryresponse=await cloudinary.uploader.upload(docavatar.tempFilePath)
if(!cloudinaryresponse || cloudinaryresponse.error){
    console.error("Cloudinary error" || cloudinaryresponse.error || "Unknown cloudinary error")
}

const doctor=await User.create({
        firstname,
        lastname,
        email,
        phone,
        nic,
        dob,
        gender,
        password,
        doctordepartment,
        role:"Doctor", 
        docavatar:{
            public_id:cloudinaryresponse.public_id,
            url:cloudinaryresponse.secure_url,
        }
});

res.status(200).json({
    success:true,
    message:"New doctor registered",
    doctor
})

});

