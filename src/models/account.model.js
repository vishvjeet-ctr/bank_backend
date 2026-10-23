import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
    user:{
   type:mongoose.Schema.Types.ObjectId,
   ref:"user",
   required:[true,"Account must be associated with a user"],
   index:true,
 },
 status:{
    type:String,
    enum:{
        values:["active","frozen","closed"],
        message:"Status can be active ,frozen or closed",
    },
    default:"active"
 },
 currency:{
    type:String,
    required:[true,"Currency is required for creating account"],
    default:"INR"
 }
},{
    timestamps:true
})

accountSchema.index({user:1,status:1})

export const accountModel = mongoose.model("account",accountSchema)