import express from "express";
import { addnewadmin, addnewdoctor, adminlogout, getalldoctors, getuserdetails, login, patientlogout, patientregister } from "../controllers/usercontroller.js";
import { isadminauthenticated, ispatientauthenticated } from "../middlewares/auth.js";
const router=express.Router();

router.post("/patient/register", patientregister);
router.post("/login", login);
router.post("/admin/addnew", isadminauthenticated, addnewadmin);
router.get("/doctors", getalldoctors);
router.get("/admin/me", isadminauthenticated, getuserdetails);
router.get("/patient/me", ispatientauthenticated, getuserdetails);
router.get("/admin/logout", isadminauthenticated, adminlogout);
router.get("/patient/logout", ispatientauthenticated, patientlogout);
router.post("/doctor/addnew", isadminauthenticated, addnewdoctor);

export default router;