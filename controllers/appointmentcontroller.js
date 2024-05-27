import { catchasyncerror } from "../middlewares/catchasyncerror.js";
import ErrorHandler from "../middlewares/errormiddleware.js";
import { Appointment } from "../models/appointmentschema.js";
import { User } from "../models/userschema.js";

export const postappointment=catchasyncerror(async(req, res, next)=>{
    const {
        firstname,
        lastname,
        email,
        phone,
        nic,
        dob,
        gender,
        appointment_date,
        department,
        doctor_firstname, 
        doctor_lastname,
        hasvisited,
        address,
    }=req.body;

    if(
        !firstname||
        !lastname||
        !email||
        !phone||
        !nic||
        !dob||
        !gender||
        !appointment_date||
        !department||
        !doctor_firstname|| 
        !doctor_lastname||
        !address
    ){
        return next(new ErrorHandler("Please provide complete details", 400))
    }

    const isconflict=await User.find({
        firstname:doctor_firstname,
        lastname:doctor_lastname,
        doctordepartment:department,
        role:"Doctor"
    })

    if(isconflict.length===0){
        return next(new ErrorHandler("Doctor not found", 404));
    }

    if(isconflict.length>1){
        return next(new ErrorHandler("Doctor Conflict, please contact through phone or email", 404));
    }

    const doctorid=isconflict[0].id;
    const patientid=req.user._id;
    const appointment=await Appointment.create({
        firstname,
        lastname,
        email,
        phone,
        nic,
        dob,
        gender,
        appointment_date,
        department,
        doctor:{
            firstname:doctor_firstname, 
            lastname:doctor_lastname
        },
        hasvisited,
        address,
        doctorid,
        patientid
    })

    res.status(200).json({
        success:true,
        message:"Appointment sent successfully.",
        appointment
    })
});


export const getallappointments=catchasyncerror(async(req, res, next)=>{
    const appointments=await Appointment.find();
    res.status(200).json({
        success:true,
        appointments
    })
});


export const updateappointmentstatus=catchasyncerror(async(req, res, next)=>{
    const {id}=req.params;
    let appointment=await Appointment.findById(id);
    if(!appointment){
        return next(new ErrorHandler("Appointment not found", 404));
    }

    appointment=await Appointment.findByIdAndUpdate(id, req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });
    res.status(200).json({
        success:true,
        message:"Appointment status updates",
        appointment
    })
})

export const deleteappointment=catchasyncerror(async(req, res, next)=>{
    const {id}=req.params;
    let appointment=await Appointment.findById(id);
    if(!appointment){
        return next(new ErrorHandler("Appointment not found", 404));
    }

    await appointment.deleteOne();
    res.status(200).json({
        success:true,
        message:"Appointment deleted"
    })
})