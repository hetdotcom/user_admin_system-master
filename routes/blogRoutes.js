const express=require('express')
const {  getBlogs,getLoggedInBlogs,likeBlog,unLikeBlog,createBlogs,updateBlogs,deleteBlogs, publishABlog}=require('../controllers/blogController')
//const{ validateCreateBlogs}=require('../validators/blogsValidator')
const{protect}=require('../middlewares/authMiddleware')
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, 'uploads/coverImage/')
    },
    filename: function(req, file,cb){
        cb(null, file.originalname) //new Date().toISOString().replace(/:/g, '-') + 
       
    }
})
const fileFilter = (req, file, cb) => {
    if(file.mimetype ==='image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true)
    }else{
        cb(null, false)
    }
}
const uploadCoverImage=multer({storage:storage,
    limits: { fileSize: 1024 * 1024 * 5}, 
    fileFilter:  fileFilter

}) 

const router=express.Router()
router.get('/',getBlogs)
router.get('/getMyBlog',protect,getLoggedInBlogs)
router.put('/likeBlog/:id',protect,likeBlog)
router.put('/unlikeBlog/:id',protect,unLikeBlog) /* New */
router.put('/publishBlog/:id',protect,publishABlog) 
router.post('/',protect,uploadCoverImage.single('coverImage'),createBlogs)
 
router.put('/:id',protect,uploadCoverImage.single('coverImage'),updateBlogs) /* New */


router.delete('/:id',protect,deleteBlogs)
module.exports=router