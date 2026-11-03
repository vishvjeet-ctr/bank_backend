import express from 'express'
import authRouter from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import accountRouter from './routes/account.routes.js'
import transactionRouter from "./routes/transaction.routes.js"
import rateLimitExpress from './config/limiter.js';

const app = express();


app.use(express.json())
app.use(cookieParser())
app.use(rateLimitExpress)


app.use('/api/transaction',transactionRouter)
app.use('/api/account',accountRouter)
app.use('/api/auth',authRouter)  
  


    

export default app;
