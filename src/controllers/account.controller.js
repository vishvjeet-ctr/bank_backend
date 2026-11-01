import { accountModel } from "../models/account.model.js";

async function createAccountController(req,res){
    const user = req.user;
    if (!user) {
        return res.status(401).json({
            message: "Unauthorized access"
        })
    }

    const account = await accountModel.create({
        user: user._id
    })

    res.status(201).json({
        account
    })
}

export async function getAccountController(req,res){
    const account = await accountModel.find({
        user:req.user._id
    })

    res.status(200).json({
account
    })
}

export async function fetchBalance(req,res){
    const {accountId} = req.params

    const account = await accountModel.findOne({
        _id:accountId,
        user:req.user._id
    })

    if(!account){
        res.status(404).json({
            message:"account not find"
        })
    }

    const balance = await account.getBalance();

    res.status(200).json({
        accountId:account._id,
        balance:balance
    })
}



export default createAccountController
