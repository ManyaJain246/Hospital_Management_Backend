import { User } from "../models/userschema.js";
import { catchasyncerror } from "./catchasyncerror.js";
import ErrorHandler from "./errormiddleware.js";
import jwt from "jsonwebtoken";

export const isadminauthenticated=catchasyncerror(async(req, res, next)=>{
    const token=req.cookies.adminToken;
    if(!token){
        return next(new ErrorHandler("Admin not authenticated", 400));
    }

    const decoded=jwt.verify(token, process.env.JWT_sECRET_KEY);
    req.user=await User.findById(decoded.id);
    // authorisation
    if(req.user.role!=="Admin"){
        return next(new ErrorHandler(`${req.user.role} is not authorised for this resource.`, 403))
    }
    next();
});

export const ispatientauthenticated=catchasyncerror(async(req, res, next)=>{
    const token=req.cookies.patientToken;
    if(!token){
        return next(new ErrorHandler("Patient not authenticated", 400));
    }

    const decoded=jwt.verify(token, process.env.JWT_sECRET_KEY);
    req.user=await User.findById(decoded.id);
    // authorisation
    if(req.user.role!=="Patient"){
        return next(new ErrorHandler(`${req.user.role} is not authorised for this resource.`, 403))
    }
    next();
})