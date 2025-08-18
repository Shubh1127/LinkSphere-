import { Router } from "express";
import { activecheck, getAllPost ,deletePost } from "../controllers/post.controllers.js";
import { commentPost, increment_Likes, getAllComments, deleteComment, getCommentsByPostId, getPostsByUsername } from "../controllers/post.controllers.js";
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
router.route("/comment").post(commentPost)
router.route("/comments").get(getAllComments)
router.route("/comments/:postId").get(getCommentsByPostId)
router.route("/delete_comment").delete(deleteComment)
router.route("/like").post(increment_Likes)
router.route("/posts/by_user/:username").get(getPostsByUsername)

export default router;