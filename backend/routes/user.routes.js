import {Router} from 'express'
import multer from 'multer'

import { login, register,uploadProfilePicture,updateUserProfile,getUserAndProfile, updatePofileData,getAllUserProfile, downloadProfile, sendConnectionRequest, getMyConnectionRequests, whatAreMyConnections, acceptConnectionRequest, logoutUser, getPublicProfile, searchUsers, AboutMe, getMySentConnectionRequests, updatePassword, updateBasicProfile, addWorkHistory, addEducation } from '../controllers/user.controllers.js';

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
.route('/logout')
.post(logoutUser)

router 
.route('/update_profile_picture')
.post(upload.single('profile_picture'),uploadProfilePicture)


router
.route("/user_update")
.post(updateUserProfile)

router.route("/user/public_profile/me")
.get(AboutMe)

router.route('/get_user_and_profile')
.get(getUserAndProfile)

router
.route("/update_profile_data")
.post(updatePofileData)

router.route("/user/get_all_users").get(getAllUserProfile)

router.route("/user/download_resume").get(downloadProfile)

router.route("/user/send_connection_request").post(sendConnectionRequest)
router.route("/user/get_connection_request").post(getMyConnectionRequests)
router.route("/user/user_connection_request").post(whatAreMyConnections)
router.route("/user/accept_connection_request").post(acceptConnectionRequest)
router.route("/user/public_profile/:username").get(getPublicProfile)
router.route("/user/search").get(searchUsers) // NEW: search endpoint
router.route("/user/my_sent_requests").get(getMySentConnectionRequests)
router.post("/user/update_password", updatePassword);
router.post("/user/update_basic_profile", updateBasicProfile);
router.post("/user/add_work_history", addWorkHistory);
router.post("/user/add_education", addEducation);
export default router

