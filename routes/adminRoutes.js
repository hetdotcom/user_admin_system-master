const express=require('express')
const router=express.Router()
const{getBlogs,getUsers, filterOnLikes,search, filterOnPublished, filterOnUnPublished, filterOnDates}=require('../controllers/adminController')

router.get('/getBlogs',getBlogs)
router.get('/getUsers',getUsers)
router.get('/filterOnLikes',filterOnLikes)
router.post('/filterOnPublished',filterOnPublished)
router.post('/filterOnUnPublished',filterOnUnPublished)
router.post('/filterOnDates',filterOnDates)
router.post('/search',search)

module.exports=router