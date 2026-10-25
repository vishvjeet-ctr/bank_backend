import mongoose, { mongo } from "mongoose";

const teansactionSchema = new mongoose.Schema({
    fromAccount:{
        type :mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true,"Transaction must be associated with a from account"],
        index :true
    },

    toAccount:{
        type :mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true,"Transaction must be associated with a from account"],
        index :true
    },
    status:{
        type:String,
        enum:{
            values:["pending","completed","Failed","Reversed"],
            message:"status can be either Pending,completed,failed or reversed",

        },
        default:"Pending"
    },
    ammount:{
        type:Number,
        required:[true,"Ammount is required for creating a transaction"],
        min:[0,"Transaction ammount cannot be negative"]
    },
    idempotencyKey:{
        type:String,
        required:[true,"idempotency key is required for creating a transaction"],
        index:true,
        unique:true
    }
},{
    timestamps:true
})

export const transactionModel = mongoose.model("transaction",teansactionSchema)