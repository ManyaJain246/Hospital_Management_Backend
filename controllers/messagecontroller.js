import { catchasyncerror } from "../middlewares/catchasyncerror.js";
import {Message} from "../models/messageschema.js"
import ErrorHandler from "../middlewares/errormiddleware.js"
import { User } from "../models/userschema.js";
export const sendmessage=catchasyncerror(async(req, res, next)=>{
   const {firstname, lastname, email, phone, message}=req.body;
   if(!firstname || !lastname || !email || !phone || !message){
    return next(new ErrorHandler("Please fill full form", 400))
}
   await Message.create({firstname, lastname, email, phone, message});
    res.status(200).json({
    success:true,
    message:"Message sent successfully"
   })

})

export const getallmessages=catchasyncerror(async(req, res, next)=>{
   const messages=await Message.find();
   res.status(200).json({
      success:true,
      messages
   })
})