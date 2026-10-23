import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken"
import { sendRegistrationEmai } from "../services/email.services.js";

export const userRegisterController =async (req,res)=>{
    const {email,password,name} = req.body
    const find = await userModel.findOne({
        email:email
    })
    if(find){
        return res.status(422).json({
            message:"user already exits with email",
            status:"failed"
        })
    }

    const user = await userModel.create({
        email,password,name
    })
    const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{
        expiresIn:"3d"
    })

    res.cookie("token",token)

    res.status(201).json({
        name:user.name,
        _id:user._id,
        email:user.email
      },token,
    );
 await sendRegistrationEmai(user.email,user.name)
}

export const userLoginController = async(req,res)=>{
    const {email,password} = req.body;
    const verify = await userModel.findOne({
        email:email
    }).select("+password")
    if(!verify) return res.status(401).json({
        message:"user not find",
        status:failed
    })

    const isVaildPassword = await verify.comparePassword(password)
    
    if(!isVaildPassword){ 
        return res.status(401).json({
            message:" Email or password is invalid",
        })
    }

       const token = jwt.sign({userId:verify._id},process.env.JWT_SECRET,{
        expiresIn:"3d"
    })

    res.cookie("token",token)

    res.status(200).json({
        name:verify.name,
        _id:verify._id,
        email:verify.email
    },token
);
}

