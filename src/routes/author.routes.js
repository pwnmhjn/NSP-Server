import { Router } from "express";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { getAuthors, getAuthorInfo } from "../controllers/author.controller.js";



const router = Router()

router.route("/get-authors").get(verifyJwt, getAuthors)
router.route("/:id").get(verifyJwt, getAuthorInfo)



export default router;