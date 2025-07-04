import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js";
import { app, server } from "./socket/socket.js";
import path from "path";

dotenv.config({});

const PORT = process.env.PORT||3000;

const __dirname = path.resolve();

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({extended:true}));
const corsOptions = {
    origin:process.env.FRONTEND_URL,
    credentials:true
}
app.use(cors(corsOptions));

//routes
app.use("/api/v1/user", userRoute);                //"http://localhost:8000/api/v1/user"
app.use("/api/v1/post", postRoute);  
app.use("/api/v1/message", messageRoute);

server.listen(PORT, ()=>{
    connectDB();
    console.log(`Server is listen at port ${PORT}`);
})