import { Router } from "express";
import { activecheck, getAllPost } from "../controllers/post.controllers.js";
import multer from 'multer';
const router=Router();
import {createPost } from '../controllers/post.controllers.js';

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"uploads/")
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
})

const upload=multer({storage:storage})
router.route("/").get(activecheck)

router.route("/post").post(upload.single('media'),createPost)
router.route("/posts").get(getAllPost)
router.route("/delete_post").delete(deletePost) 
export default router;