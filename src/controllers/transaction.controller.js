import { transactionModel } from "../models/transaction.model.js";
import { ledgerModel } from "../models/ledger.model.js";
import { accountModel } from "../models/account.model.js";
import mongoose from "mongoose";
import { sendTransaction } from "../services/email.services.js";

export async function createTransaction(req,res){
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

    const balance = await fromUserAccount.getBalance()
    
    if(balance<amount){
      res.status(400).json({
        message:`Insufficient balance.Current balance is ${balance}`
      })
    }
   
      const session = await mongoose.startSession()
      session.startTransaction()

      const transaction = await transactionModel.create([{
        fromAccount,
        toAccount,
        amount,
        idempotencyKey,
        status:"pending"
      }],{session})

      const ledgerDebitEntry = await ledgerModel.create([{
        account:fromAccount,
        amount,
        transaction:transaction._id,
        type:"DEBIT",
      }],{session})

      const ledgerCreditEntry = await ledgerModel.create([{
        account:toAccount,
        amount,
        transaction:transaction._id,
        type:"CREDIT"
      }],{session})

      transaction.status = "completed"
      await transaction.save({session})

      await session.commitTransaction()
      session.endSession()

      await sendTransaction(req.user.email,req.user.name,amount,toAccount)
     
      return res.status(201).json({
        message:"Transaction completed successfully",
        transaction
      })
}

