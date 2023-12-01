import http from "http";
import app from "./app.js";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 3001;

const server = http.createServer(app);

if(!process.env.IS_VERCEL){
  server.listen(port, () => {
      console.log(`Server running on port: ${port}`);
  })
}

export default app; 
