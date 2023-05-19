const mongoose=require('mongoose')
const userSchema=mongoose.Schema({
    sName:{
        type:String,
        required:[true,'Please add a name'],
    },
    sEmail:{
        type:String,
        required:[true,'Please add an email'],
        unique:true
    },
    sPassword:{
        type:String,
        required:[true,'Please add a password'],    
    },

    sUsername:{
        type:String,
        required:[true,'Please add a username'],
        unique:true
    },

   
    nMobile:{
        type:String,
        required:[true,'Please add a number']
    },
    sGender:{
        type:String,
        required:[true,'Please add a gender'],        
    },
    
    sRole:{
        type:String,
        default:'user'
    },
    sProfilePhoto:{
        type:String,
        
    },
    isLoggedIn:{
        type:Boolean,
        default:false
    }
},{timestamps:true})
const Users=mongoose.model('User',userSchema)
module.exports=Users