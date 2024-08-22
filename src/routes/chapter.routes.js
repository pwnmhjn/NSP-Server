import { Router } from "express";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { getChapter } from "../controllers/chapter.controller.js";




const router = Router()

router.route("/get-chapters").get(verifyJwt, getChapter)
export default router;