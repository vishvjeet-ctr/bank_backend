import mongoose from 'mongoose'
import dotenv from "dotenv"
import dns from "node:dns"

dotenv.config();
dns.setServers(["8.8.8.8", "8.8.4.4"]);


function connectDB(){
    mongoose.connect(process.env.MONGODB)
    .then(()=>{
        console.log("mongodb connected")
    
    })
    .catch(err=>{
        console.error("error connecting to DB",err.message)
        process.exit(1)
    })
}

export default connectDB;

