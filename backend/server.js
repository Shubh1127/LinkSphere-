import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import postRoutes from "./routes/post.routes.js"
import userRoutes from "./routes/user.routes.js"

dotenv.config();

const app = express();
app.use(cookieParser());
app.use(cors({
  origin:"http://localhost:3000" || process.env.FRONTEND_URL,
  credentials:true,
  methods:"GET,HEAD,PUT,PATCH,POST,DELETE",
}));
app.use(express.json());
app.use(express.static('uploads'));
app.use(postRoutes)
app.use(userRoutes)
const port = 9090;
const start = async () => {
  const connect = await mongoose.connect(
    process.env.MONGO_URL
  );
  try {
    if (connect) {
      app.listen(port, () => {
        console.log("server started at port :" + port);
        console.log("connected to database");
      });
    }
  } catch (error) {
    console.log("error connecting in databse : " + error);
  }
};
start();
