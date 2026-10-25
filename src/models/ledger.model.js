import mongoose from "mongoose";

const ledgerSchema = new mongoose.Schema({
    account:{
        type:String,
        required:[true,"Ammount is required for creating a ledger entry"],
        immutable:true
    },
    transaction:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"transaction",
      required:[true,"Ledger must be associated a transaction"],
      index:true,
      immutable:true
    },
    type:{
        type:String,
        enum:{
            values:["CREDIT","DEBIT"],
            message:"type can be either creadit or debit",

        },
        required:true,
        immutable:true,
    }
})

function preventLedgerModification(){
    throw new errorMonitor("Ledger entries are immutable and can not modified or delete")
}

ledgerSchema.pre('findOne',preventLedgerModification);
ledgerSchema.pre('updateOne',preventLedgerModification);
ledgerSchema.pre('deleteOne',preventLedgerModification);
ledgerSchema.pre('remove',preventLedgerModification);
ledgerSchema.pre('deleteMany',preventLedgerModification);
ledgerSchema.pre('updateMany',preventLedgerModification);

export const ledgerModel = mongoose.model('ledger',ledgerSchema)