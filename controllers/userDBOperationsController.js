import { check, validationResult } from "express-validator";
import { connectToDatabase } from "../db/dbConnect.js"
import {
    insertUser,
    updateUserTitle,
    getUserByToken,
    getUserByEmail,
    UserByCriteria,
    getAllUsers,
    profileUpdate,
    deleteProfile
} from "../services/userDBOperationsServices.js";


const validationUserMiddlewareController = [
    check("email")
        .isEmail().withMessage("Please provide a valid email")
        .matches(/^[a-zA-Z0-9@._-]+$/).withMessage("Email must contain only English letters, numbers, and standard email characters"),
    check("password", "Please provide a password that is greater than 8 characters").isLength({ min: 8 })
];


const insertUserController = async (req, res) => {
    connectToDatabase();
    const data = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        return res.status(400).json({ errors: errorMessages });
    }
    const user = await getUserByEmail(data);
    if (user) {
        return res.status(400).json({ errors: ['This user already exists'] })
    } else {
        try {
            const success = await insertUser(data);
            if (success) {
                return res.status(201).json({ message: 'User inserted successfully', data: success });
            } else {
                return res.status(400).json({ error: 'User insertion failed' });
            }
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
};


const updateUserTitleController = async (req, res) => {
    try {
        connectToDatabase();
        const token = req.headers.authorization;
        const title = req.body

        const result = await updateUserTitle(token, title)
        if (result) {
            console.log("The update was successful");
            return res.status(200).json({ message: "The update was successful" });
        }
        return res.status(400).send({
            massage: "Username does not exist, you can register!"
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};


const getNamesByTokenController = async (req, res) => {
    try {
        connectToDatabase();
        const token = req.headers.authorization;

        const result = await getUserByToken(token)
        if (result) {
            return res.status(200).json({ firstName: result.firstName, lastName: result.lastName });
        }
        return res.status(400).send({
            massage: "Username does not exist, you can register!"
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};


const getAllUsersController = async (req, res) => {
    try {
        connectToDatabase();
        const result = await getAllUsers()
        if (result) {
            return res.status(200).json({ result });
        }
        return res.status(400).send({
            massage: "Username does not exist, you can register!"
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};


const getUserController = async (req, res) => {
    try {
        connectToDatabase();
        const token = req.headers.authorization;
        const result = await getUserByToken(token)
        console.log(result, 8888);
        if (result) {
            return res.status(200).json({ result });
        }
        return res.status(400).send({
            massage: "Username does not exist, you can register!"
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};


const UserByCriteriaController = async (req, res) => {
    try {
        connectToDatabase();
        const data = req.body;
        const result = await UserByCriteria(data)
        if (result) {
            return res.status(200).json({ result });
        }
        return res.status(400).send({
            massage: "Username does not exist, you can register!"
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};


const profileUpdateController = async (req, res) => {
    connectToDatabase();
    const token = req.headers.authorization;
    const data = req.body;
    if (!data.email === undefined || !data.password === undefined) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            return res.status(400).json({ errors: errorMessages });
        }
    };
    try {
        const success = await profileUpdate(data, token);
        if (success) {
            return res.status(201).json({ message: 'User update successfully', data: success });
        } else {
            return res.status(400).json({ error: 'User update failed' });
        }
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};


const deleteProfileController = async (req, res) => {
    try {
        connectToDatabase();
        const token = req.headers.authorization;

        const result = await deleteProfile(token)
        if (result) {
            console.log("Your account has been successfully deleted");
            return res.status(200).json({ message: "Your account has been successfully deleted" });
        }
        return res.status(400).send({
            massage: "Username does not exist, you can register!"
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

export {
    validationUserMiddlewareController,
    insertUserController,
    updateUserTitleController,
    getNamesByTokenController,
    getAllUsersController,
    getUserController,
    UserByCriteriaController,
    profileUpdateController,
    deleteProfileController
}