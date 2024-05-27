import mongoose from "mongoose";

export const dbconnections=()=>{
    mongoose.connect(process.env.MONGO_URI, {
        dbName:"Hospital_Management_System",
    }).then(()=>{
        console.log("Connected Successfully")
    }).catch((err)=>{
        console.log("Some error occurred")
    })
}