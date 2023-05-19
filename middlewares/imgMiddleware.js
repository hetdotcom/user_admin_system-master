const multer = require('multer')
const uploadCoverImage=multer({dest:'../imageUploads/coverImages'})

uploadCoverImage.single('coverImage')