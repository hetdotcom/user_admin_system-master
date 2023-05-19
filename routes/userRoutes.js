const express=require('express')
const {registerUser,loginUser,deleteUser,getLoggedinUser,logoutUser, editProfile,changePassword,forgotPassword,resetPassword}=require('../controllers/userController')
//const{ validateUsers}=require('../validators/userValidator')
const{protect}=require('../middlewares/authMiddleware')
const router=express.Router()
const multer = require('multer')



const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, 'uploads/profilePhoto/')
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
const uploadProfileImage=multer({storage:storage,
    limits: { fileSize: 1024 * 1024 * 5}, 
    fileFilter:  fileFilter

})

router.post('/',uploadProfileImage.single('sProfilePhoto'),registerUser)

router.get('/me',protect,getLoggedinUser)
router.post('/login',loginUser)
/* New */
router.post('/logout',logoutUser)/* New */
router.post('/forgotPassword',forgotPassword)/* New */
router.put('/:id',uploadProfileImage.single('sProfilePhoto'),editProfile)/* New */
router.put('/changePassword/:id',changePassword)/* New */
router.post('/resetPassword',resetPassword)/* New */
router.delete('/:id',deleteUser)
module.exports=router

