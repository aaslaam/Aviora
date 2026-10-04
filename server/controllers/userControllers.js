import bcrypt from "brcyptjs"

import User from "../Models/Users.js"
import generateToken from "../lib/utils.js"

export const signup = async (res,req)=>{
    const [fullName,email,password,bio] = req.body
    try {
        if(!fullName || !email || !password || !bio){
            return res.json({success:false,message:"Missing Details"})
        }
        const user = await User.findOne({email})

        if(user){
            return res.json({success:false,message:"Account Already Exists"})

        }
        const salt = await bcrypt.genSalt(10)
        const hashedPass = await bcrypt.hash(password,salt)

        const newUser = await User.create({
            fullName,email,password:hashedPass,bio
        })
        const token = generateToken(newUser._id)
        res.json({success:true,userData:newUser,token,message:"Account Created Sucessfully"})
    } catch (error) {
       console.error();
       
        
        res.json({success:false,message:error.meesage});
        })
        
    }
}