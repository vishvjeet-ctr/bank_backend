
import jwt from "jsonwebtoken"
import userModel from "../models/user.model.js";


async function authMiddleware(req,res,next){
    const authorization = req.get("authorization")
    const token = req.cookies?.token || authorization?.split(" ")[1]
    if(!token){
        return res.status(401).json({
          message:"Unauthorize access,token is missing"  
        })
    }

    try {
        const decode = jwt.verify(token,process.env.JWT_SECRET)
        const user = await userModel.findById(decode.userId)
        if (!user) {
            return res.status(401).json({
              message:"Unauthorize access, user not found"
            })
        }
        req.user = user
         return next()
    } catch (error) {
          return res.status(401).json({
          message:"Unauthorize access,token is missing"  
        })
    }

}

export default authMiddleware
