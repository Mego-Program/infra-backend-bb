import { Router } from "express";
import verifyToken from "../middelWare/auth_JWT.js";
import loginUserController from '../controllers/userAuthController.js';
import {
    insertUserControllerMiddleware,
    insertUserController,
    updateUserTitleController,
    getNamesByEmailController,
    getAllUsersController,
    getUserController,
    UserByCriteriaController
} from '../controllers/userDBOperationsController.js';


const router = Router();

router.get("/verifyToken", verifyToken)
router.post("/register", insertUserControllerMiddleware, insertUserController);
router.post("/userTitle", updateUserTitleController);
router.post("/login", loginUserController);
router.get("/avatar", getNamesByEmailController);
router.get("/users", getAllUsersController); //Get all users
router.get("/me", getUserController) //Get current user info by email
router.get("/profile", getUserController) // Get single user by email
router.post("/findUsers", UserByCriteriaController) //Search users by first name, last name, email, username (?)

export default router;