const mongoose=require('mongoose')
const blogSchema=mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        // required:true,
        ref:'User'
    },
    title:{
        type:String,
        required:[true,'Please add a title'],
        unique:true
    },
    description:{
        type:String,
        required:[true,'Please add a description'],
    },
    createdDate:{
        type: Date, 
        default: Date.now,
        required:true
    },

    publishedDate:{
        type:Date,
        default: Date.now,
        required:true,
    },
    coverImage:{
        type: String},
    likeButton:{
        type:Array,
        default:[]
    },
    sUsername:{
        type:String,
        ref:'User'
    },
    isPublished:{
        type:Boolean,
        default:false
    }//newline
    
   
    
},
{ timestamps: false})
const Blogs=mongoose.model('Blogs',blogSchema)
module.exports=Blogs