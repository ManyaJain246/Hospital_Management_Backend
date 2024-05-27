import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const userSchema=new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },

    lastname:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true,
        validate:[validator.isEmail, "Please provide a valid email"]
    },

    phone:{
        type:String,
        required:true
    },

    nic:{
        type:String,
        required:true
    },

    dob:{
        type:Date,
        required:[true, "Date of Birth is required"]
    },

    gender:{
        type:String,
        required:true,
        enum:["Male", "Female", "Other"]
    },

    password:{
        type:String,
        required:true,
        minLength:[8, "Password must contain 8 characters"],
        select:false
    },

    role:{
        type:String,
        required:true,
        enum:["Admin", "Patient", "Doctor"]
    },

    doctordepartment:{
        type:String
    },

    docavatar:{
        public_id:String,
        url:String
    }
});

userSchema.pre("save", async function(next){
if(!this.isModified("password")){
    next();
}
this.password=await bcrypt.hash(this.password, 10)
});

userSchema.methods.comparepassword=async function(enteredpassword){
    return await bcrypt.compare(enteredpassword, this.password)
};

userSchema.methods.generateJsonWebToken=function(){
    return jwt.sign({id:this._id}, process.env.JWT_sECRET_KEY, {
        expiresIn:process.env.JWT_EXPIRES,
    })
}

export const User=mongoose.model("User", userSchema)