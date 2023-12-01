import http from "http";
import app from "./index.js";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 3001;

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Server running on port: ${port}`);
})
