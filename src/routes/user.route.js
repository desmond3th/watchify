import { Router } from "express";
import { loginUser, logoutUser, regUser, refreshAccessToken, changePassword, getCurrentUser, 
            updateUserDetails, updateUserAvatar, updateUserCoverImage} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const route = Router()

// it will take to the register controller
route.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    regUser) // make sure to send the POST status.

route.route("/login").post(loginUser)

route.route("/logout").post(verifyJWT, logoutUser)
route.route("/refresh-token").post(refreshAccessToken)
route.route("/change-password").post(verifyJWT, changePassword)
route.route("/current-user").get(verifyJWT, getCurrentUser)
route.route("/update-account").patch(verifyJWT, updateUserDetails)

route.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
route.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)

export default route