import app from "./app.js";
import connectDB from "./config/db.js";


const port = 5000;

app.get('/',(req,res)=>{
    res.send("hello")
}) 
connectDB();           

app.listen(port,()=>console.log(`server running on ${port}`))         