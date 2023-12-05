import { Router } from "express";
import verifyToken from "../middelWare/auth_JWT_Service.js";
import loginUserController from '../controllers/userAuthController.js';
import {
    validationUserMiddlewareController,
    insertUserController,
    updateUserTitleController,
    getNamesByTokenController,
    getAllUsersController,
    getUserController,
    UserByCriteriaController,
    profileUpdateController,
    deleteProfileController
} from '../controllers/userDBOperationsController.js';


const router = Router();

router.get("/verifyToken", verifyToken)
router.post("/register", validationUserMiddlewareController, insertUserController);
router.post("/userTitle", updateUserTitleController);
router.post("/login", loginUserController);
router.get("/avatar", getNamesByTokenController);
router.get("/users", getAllUsersController); //Get all users
router.get("/me", getUserController) //Get current user info by email
router.post("/findUsers", UserByCriteriaController) //Search users by first name, last name, email, username (?)
router.get("/profile", getUserController) // Get single user by email
router.put("/profileUpdate",validationUserMiddlewareController, profileUpdateController) // Update user title
router.put("/deleteProfile", deleteProfileController) // Get single user by email

export default router;