import jwt from "jsonwebtoken"

// gen token func
const generateToken = (userId)=>{
    const  token= jwt.sign({userId},process.env.JWT_SECRET)
    return token
}