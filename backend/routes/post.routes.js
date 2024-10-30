import { Router } from "express";
import { activecheck } from "../controllers/post.controllers.js";
const router=Router();

router.route("/").get(activecheck)


export default router;