import express from "express"
import { getallmessages, sendmessage } from "../controllers/messagecontroller.js";
import { isadminauthenticated } from "../middlewares/auth.js";

const router=express.Router();

router.post("/send", sendmessage)
router.get("/getall", getallmessages);

export default router;