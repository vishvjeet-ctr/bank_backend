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



export default createAccountController
