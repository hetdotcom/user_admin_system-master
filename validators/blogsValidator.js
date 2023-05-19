const messages=require('../messages')
const validateCreateBlogs=async(req,res,next)=>{
    try{
        const{title, description}=await req.body
        if(!title)
        {
            return res.status(messages.status.statusNotFound).json(messages.messages.titleRequired)
        }       
        if(!description)
        {
            return res.status(messages.status.statusNotFound).json(messages.messages.desciptionRequired)
        }   

        next()
    
    } 
    catch(error){
        console.log(error)
    }
}
module.exports={
    validateCreateBlogs
}