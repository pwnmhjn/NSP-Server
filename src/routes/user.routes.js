import { Router } from 'express';
import { userRegistration, userLogin, getAccessToken, getUsers, userLogOut, updateUserInfo, updateAvatar, updateCover } from '../controllers/user.controller.js';
import { verifyJwt } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/multer.middleware.js';
const router = Router();

router.route('/register').post(userRegistration);
router.route('/login').post(userLogin);
router.route("/get-access-token").get(getAccessToken)
router.route("/get-users").get(verifyJwt, getUsers)
router.route("/logout").get(verifyJwt, userLogOut)
router.route("/update-userInfo").put(verifyJwt, updateUserInfo)
router.route("/update-avatar").put(verifyJwt, upload.single('avatar'), updateAvatar)
router.route("/update-cover").put(verifyJwt, upload.single('coverImage'), updateCover)

export default router;
