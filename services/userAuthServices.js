import { User } from '../models/userSchema.js';
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({
    path: './.env'
});

const jwtSecret = process.env.JWT_SECRET;

async function loginUser(data) {
    try {
        const documents = await User.findOne({ email: data.email, isDelete: { $ne: true } });
        if (!documents) {
            console.log("Username does not exist, you can register!");
            return false //"Username does not exist, you can register!"
        } else {
            const isPasswordValid = await bcrypt.compare(data.password, documents.password);
            if (isPasswordValid) {

                // Set the expiration time (in seconds)
                const expiresIn = 864000000000; // 24 hour

                const payload = {
                    email: data.email,
                    timestamp: Date.now(),
                };

                const token = JWT.sign(payload, jwtSecret, { expiresIn }, { algorithm: "HS256" });

                const result = { token: token, title: documents.title }
                return result
            } else {
                console.log("Email or Password is incorrect.");
                return false
            }
        }
    } catch (e) {
        if (e.message.includes('buffering timed out')) {
            console.warn(`Query attempt ${retries + 1} timed out. Retrying...`);
            retries++;
            await new Promise(resolve => setTimeout(resolve, RETRY_INTERVAL));
        } else {
            console.error('Error while querying users:', e);
            throw new Error('An error occurred: ' + e);
        }
    }
}

export default loginUser;