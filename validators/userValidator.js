/*^

Regex for usernname
^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$
 └─────┬────┘└───┬──┘└─────┬─────┘└─────┬─────┘ └───┬───┘
       │         │         │            │           no _ or . at the end
       │         │         │            │
       │         │         │            allowed characters
       │         │         │
       │         │         no __ or _. or ._ or .. inside
       │         │
       │         no _ or . at the beginning
       │
       username is 8-20 characters long 
       
       or (?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$
       
     
     
Mobile regex:     Regex: /^(\+\d{1,3}[- ]?)?\d{10}$/
^ start of line
A + followed by \d+ followed by a or - which are optional.
Whole point two is optional.
Negative lookahead to make sure 0s do not follow.
Match \d+ 10 times.
Line end.
     
       */


const messages=require('../messages')
const validateUsers=async(req,res,next)=>{
    try{
        const{ sEmail,sPassword,sUsername,nMobile,sGender}=await req.body
        const userRegex=/(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/
        // eslint-disable-next-line no-useless-escape
        const emailRegex=/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
        const mobileRegex=/^(\+\d{1,3}[- ]?)?\d{10}$/
        //const genderOptions='Male'||'Female'||'Others'
        if( !sEmail||!sPassword|| !sUsername|| !nMobile||!sGender){
            return res.status(messages.status.statusNotFound).json(messages.messages.mandatoryFields)
        }
        
        if(userRegex.test(sUsername)===false)
        {
            return res.status(messages.status.badrequest).json(messages.messages.userNamePattern)
        }       
        if(emailRegex.test(sEmail)===false)
        {
            return res.status(messages.status.badrequest).json(messages.messages.emailPattern)
        }   

        if(mobileRegex.test(nMobile)===false){
            return res.status(messages.status.badrequest).json(messages.messages.validMobile)
        }

        // if(sGender!=='Male' || sGender!=='Female' || sGender!=='Others'){
        //     return res.status(messages.status.badrequest).json(messages.messages.validGender)
        // }

        next()
    
    } 
    catch(error){
        console.log(error)
    }
}
module.exports={
    validateUsers
}