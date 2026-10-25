import { transactionModel } from "../models/transaction.model.js";
import { ledgerModel } from "../models/ledger.model.js";
import { accountModel } from "../models/account.model.js";
import SendmailTransport from "nodemailer/lib/sendmail-transport.js";
import { json } from "express";



async function createTransaction(req,res){
    const {fromAccount,toAccount,amount,idempotencyKey} = req.body

    if(!fromAccount || !toAccount || !amount|| !idempotencyKey){
       return res.status(400).json({
            message:"fromAccount,toAccount,amount and idempotencyKey are required"
        })
    }

    const fromUserAccount = await accountModel.findOne({
        _id: fromAccount
    })

            const toUserAccount = await accountModel.findOne({
                _id: toAccount
        })

    if(!fromUserAccount || !toUserAccount){
        return res.status(400).json({
            message:"Invaild fromAccount or toAccount"
        })
    }

    const IsTransactionAlreadyExits = await transactionModel.findOne({
        idempotencyKey:idempotencyKey
    })

    if(IsTransactionAlreadyExits){
        if(IsTransactionAlreadyExits.status === "completed"){
            return res.status(200).json({
                message:"Transaction already proceed",
                transaction:IsTransactionAlreadyExits
            })
        }

         if(IsTransactionAlreadyExits.status === "pending"){
            return res.status(200).json({
                message:"Transaction is still pending",
            })
        }

         if(IsTransactionAlreadyExits.status === "Failed"){
            return res.status(202).json({
                message:"Transaction failed",
                
            })
         }

         if(IsTransactionAlreadyExits.status === "reversed"){
            return res.status(500).json({
                message:"Transaction was reversed, please retry",
                
            })
         }
    }

    if(fromUserAccount.status!="active" || toUserAccount !="active"){
        return re.status(400).json({
            message:"Both account must be active"
        })
    }

    


}