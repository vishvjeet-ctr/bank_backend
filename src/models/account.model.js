import mongoose from "mongoose";
import { ledgerModel } from "./ledger.model.js";

const accountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "Account must be associated with a user"],
        index: true,
    },
    status: {
        type: String,
        enum: {
            values: ["active", "frozen", "closed"],
            message: "Status can be active ,frozen or closed",
        },
        default: "active"
    },
    currency: {
        type: String,
        required: [true, "Currency is required for creating account"],
        default: "INR"
    }
}, {
    timestamps: true
})

accountSchema.index({ user: 1, status: 1 })

accountSchema.method.getBalance = async function () {
    const balancedata = await ledgerModel.aggregate([
        { $match: { account: this_id } },
        {
            $group: {
                _id: null,
                totalDebit: {
                    $sum: {
                        $cond: [
                            { $eq: ["$type", "DEBIT"] },
                            "$amount",
                            0
                        ]
                    }
                },
                totalCreadit: {
                    $sum: {
                        $cond: [
                            { $eq: ["$type", "CREDIT"] },
                            "$amount",
                            0
                        ]
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                balance: { $subtract: ["$totalCreadit", "$totalDebit"] }
            }
        }
    ])

    if(balancedata.length === 0){
      return 0
    }
    return balancedata[0].balance
}

export const accountModel = mongoose.model("account", accountSchema)