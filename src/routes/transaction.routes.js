import express from 'express'
import authMiddleware from '../middleware/auth.middleware.js';
import { createTransaction } from '../controllers/transaction.controller.js';
import { authSystemMiddleware } from '../middleware/auth.middleware.js';
import { createInitialFund } from '../controllers/transaction.controller.js';

const router = express.Router()

router.post("/",authMiddleware,createTransaction)

router.post("/system/initial_fund",authSystemMiddleware,createInitialFund)

export default router;
