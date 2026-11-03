import rateLimit from "express-rate-limit";


const rateLimitExpress = rateLimit({
    windowMs:1000 * 60 * 1,
    limit:5,
    message:"too many request"
})

export default rateLimitExpress;