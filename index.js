import express from "express";
import bodyParser from "body-parser";
import { connectToDatabase } from "./db/dbConnect.js";
import cors from "cors";
import verifyToken from "./middelWare/auth_JWT.js";
import router from "./Routes/UsersRouts.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.get('/', (req, res) => {
    res.send('Hello Infra-Bnei-Brak Team! This is our Express server.');
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(verifyToken);
app.use("/api/users", router);

connectToDatabase();

export default app;
