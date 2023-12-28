import { User } from '../models/userSchema.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';


dotenv.config({
    path: './.env'
});

const jwtSecret = process.env.JWT_SECRET;


async function insertUser(data) {
    try {

        const password = await bcrypt.hash(data.password, 10);

        const user = new User({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: password,
            profilePicture: '' 
        });

        const result = (await user.save());

        console.log(`${result._id} document inserted.`);
        return true;
    } catch (e) {
        if (e.name === 'ValidationError' && e.errors.email) {
            // Handle the email validation error
            const errorMessage = e.errors.email.message;
            console.error('Email validation error:', errorMessage);
            throw new Error(errorMessage);
        } else {
            console.error('Error while inserting user:', e);
            throw new Error('User insertion failed');
        }
    }
};


async function updateUserTitle(token, title) {
    try {
        // const decoded = jwt.verify(token, jwtSecret);
        const user = await getUserByToken(token);

        const filter = { email: user[0].email };
        const update = { title: title.title };

        // Add the { runValidators: true } option to enforce schema validation
        const result = await User.findOneAndUpdate(filter, update, { runValidators: true });

        if (!result) {
            // Handle the case where no user was found with the provided email
            console.error("User not found");
            return false;
        }

        return true;
    } catch (e) {
        console.error('Error while querying users:', e);
        throw new Error('An error occurred: ' + e);
    }
};


async function getUserByToken(token) {
    try {
        const decoded = jwt.verify(token, jwtSecret);

        const query = {
            email: decoded.email,
            isDeleted: false
        };

        const user = await User.find(query).select('-password');
        if (!user || !user[0]) {
            return false;
        } else {
            return user;
        }
    } catch (e) {
        console.error('Error while querying users:', e);
        throw new Error('An error occurred: ' + e);
    }
};


async function getUserByEmail(data) {
    try {
        const query = {
            email: data.email,
            isDeleted: false
        };
        const documents = await User.findOne(query).select('-password');
        console.log(documents);
        if (!documents) {
            return false;
        } else {
            console.log('This user already exists');
            return documents;
        }
    } catch (e) {
        console.error('Error while querying users:', e);
        throw new Error('An error occurred: ' + e);
    }
};


async function UserByCriteria(data) {
    try {
        const query = {
            $or: [
                data.email ? { email: data.email } : null,
                data.firstName ? { firstName: { $regex: new RegExp(`^${data.firstName}$`, 'i') } } : null,
                data.lastName ? { lastName: { $regex: new RegExp(`^${data.lastName}$`, 'i') } } : null
            ].filter(condition => condition !== null),
            isDeleted: false,

        };

        const documents = await User.find(query).select('-password');
        if (!documents || !documents[0]) {
            return null; // User doesn't exist
        } else {
            // console.log('User found:', documents);
            return documents; // User exists
        }
    } catch (e) {
        console.error('Error while querying users:', e);
        throw new Error('An error occurred during the query.');
    }
};


async function getListUsers(data) {
    try {
        let documents;

        if (Object.keys(data).length === 0) {
            documents = await User.find({ isDeleted: false }).select('-password');
        } else if ('only' in data) {
            documents = await User.find({ isDeleted: false, _id: { $in: data.only } }).select('-password');
        } else if ('exclude' in data) {
            documents = await User.find({ isDeleted: false, _id: { $nin: data.exclude } }).select('-password');
        }

        if (!documents) {
            return false;
        } else {
            return documents;
        }
    } catch (e) {
        console.error('Error while querying users:', e);
        throw new Error('An error occurred: ' + e);
    }
};


async function profileUpdate(data, token) {
    try {
        const decoded = jwt.verify(token, jwtSecret);

        const filter = { email: decoded.email };
        const update = {};

        if (data.email) {
            update.email = data.email;
        }

        if (data.firstName) {
            update.firstName = data.firstName;
        }

        if (data.lastName) {
            update.lastName = data.lastName;
        }

        if (data.title) {
            update.title = data.title;
        }

        if (data.password) {
            const password = await bcrypt.hash(data.password, 10);
            update.password = password;
        }

        if (data.profilePicture) {
            update.profilePicture = data.profilePicture;
        }

        // Add the { runValidators: true } option to enforce schema validation
        const result = await User.findOneAndUpdate(filter, update, { runValidators: true }).select('-password');
        if (!result) {
            // Handle the case where no user was found with the provided email
            console.error("User not found");
            return false;
        }
        delete update.password;
        return update;
    } catch (e) {
        console.error('Error while querying users:', e);
        throw new Error('An error occurred: ' + e);
    }
};


async function deleteProfile(token) {
    try {
        const decoded = jwt.verify(token, jwtSecret);

        const filter = { email: decoded.email };
        const update = { isDeleted: true };

        // Add the { runValidators: true } option to enforce schema validation
        const result = await User.findOneAndUpdate(filter, update, { runValidators: true });
        console.log(result);
        if (!result) {
            // Handle the case where no user was found with the provided email
            console.error("User not found");
            return false;
        }
        return true;
    } catch (e) {
        console.error('Error while querying users:', e);
        throw new Error('An error occurred: ' + e);
    }
};

export {
    insertUser,
    updateUserTitle,
    getUserByToken,
    getUserByEmail,
    UserByCriteria,
    getListUsers,
    profileUpdate,
    deleteProfile
}