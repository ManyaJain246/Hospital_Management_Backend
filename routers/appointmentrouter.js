import express from "express";
import { deleteappointment, getallappointments, postappointment, updateappointmentstatus } from "../controllers/appointmentcontroller.js";
import { ispatientauthenticated, isadminauthenticated } from "../middlewares/auth.js";

const router=express.Router();

router.post("/post", ispatientauthenticated, postappointment)
router.get("/getall", isadminauthenticated, getallappointments)
router.put("/update/:id", isadminauthenticated, updateappointmentstatus)
router.delete("/delete/:id", isadminauthenticated, deleteappointment)


export default router;