import express from 'express'
import authMiddleware from '../middleware/auth.middleware.js';


const router = express.Router()

router.post("/",authMiddleware)



export default router;