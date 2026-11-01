import express from "express"
import authMiddleware from "../middleware/auth.middleware.js"
import createAccountController from "../controllers/account.controller.js"
import { getAccountController } from "../controllers/account.controller.js"
import { fetchBalance } from "../controllers/account.controller.js"


const router = express.Router()


router.post("/",authMiddleware,createAccountController)

router.get("/",authMiddleware,getAccountController)

router.get("/balance/:accountId",authMiddleware,fetchBalance)

export default router
