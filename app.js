import express from "express";
import {config} from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { dbconnections } from "./database/dbconnections.js";
import messagerouter from "./routers/messagerouter.js";
import { errormiddleware } from "./middlewares/errormiddleware.js";
import userrouter from "./routers/userrouter.js";
import appointmentrouter from "./routers/appointmentrouter.js"

const app=express();

config({path:"./config/config.env"})

app.use(cors({
    origin:[process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
    methods:["POST", "GET", "PUT", "DELETE"],
    credentials:true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp/"
}));


app.use("/api/v1/message", messagerouter)
app.use("/api/v1/user", userrouter)
app.use("/api/v1/appointment", appointmentrouter)

dbconnections();

app.use(errormiddleware)
export default app;