import mongoose from "mongoose";
import validator from "validator";

const appointmentSchema=new mongoose.Schema({
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

    appointment_date:{
       type:String,
       required:true
    },

    department:{
        type:String,
        required:true
     },

     doctor:{
        firstname:{
            type:String,
            required:true
         },

         lastname:{
            type:String,
            required:true
         },
     },

     hasvisited:{
        type:Boolean,
        default:false
     },

     doctorid:{
        type:mongoose.Schema.ObjectId,
        required:true
     },

     patientid:{
        type:mongoose.Schema.ObjectId,
        required:true
     },

     address:{
        type:String,
        required:true
     },

     status:{
        typr:String,
        enum:["Pending", "Accepted", "Rejected"],
        // default:"Pending",
     },
});

export const Appointment=mongoose.model("Appointment", appointmentSchema)