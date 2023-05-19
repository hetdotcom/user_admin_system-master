const jwt=require('jsonwebtoken')
const User=require('../schemas/userSchema')
const messages=require('../messages')

const protect=async(req,res,next)=>{
    let token
    
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            
            token = req.headers.authorization.split(' ')[1]//this will just give us the token
            
            //verify token
            const decoded=jwt.verify(token,process.env.JWT_SECRET)
            res.cookie('jwt',token,{httpOnly:true,maxAge:1000*1000})

            //get token from user and extract password
            req.users=await User.findById(decoded.id).select('-sPassword')
            next()
        }catch(error){console.log(error)
            return res.status(messages.status.statusNotFound).json(messages.messages.unAuthorized)
        }}
    else{
        console.log('error'+ token)
        return res.status(messages.status.statusNotFound).json(messages.messages.unAuthorized)
    }        
}

// const unProtect=async(req,res,next)=>{
//     res.cookie('jwt','',{maxAge:1})
//     next()
// }


//Token initially comes with Bearer.token and therefore we will split it in array
module.exports={
    protect,
    //unProtect
}