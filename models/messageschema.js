import mongoose from "mongoose";
import validator from "validator";

const messageSchema=new mongoose.Schema({
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

    message:{
        type:String,
        required:true
    },
})

export const Message=mongoose.model("Message", messageSchema)