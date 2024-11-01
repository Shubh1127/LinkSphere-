import {Router} from 'express'
import multer from 'multer'

import { login, register,uploadProfilePicture,updateUserProfile,getUserAndProfile, updatePofileData,getAllUserProfile } from '../controllers/user.controllers.js';

const router=Router();
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/')
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
})
const upload =multer({storage:storage})

router
.route('/register')
.post(register)

router
.route('/login')
.post(login)

router 
.route('/update_profile_picture')
.post(upload.single('profile_picture'),uploadProfilePicture)


router
.route("/user_update")
.post(updateUserProfile)

router.route('/get_user_and_profile')
.get(getUserAndProfile)

router
.route("/update_profile_data")
.post(updatePofileData)

router.route("/user/get_all_users").get(getAllUserProfile)

router.route("/user/download_resume")

export default router

