import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import postRoutes from "./routes/post.routes.js"

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(postRoutes)
const port = 8080;
const start = async () => {
  const connect = await mongoose.connect(
    "mongodb+srv://shubhamsinghmor2312:Mummy4589@linkedinclone.utn0a.mongodb.net/?retryWrites=true&w=majority&appName=LinkedinClone"
  );
  try {
    if (connect) {
      app.listen(port, () => {
        console.log("server started at port :" + port);
        console.log("connected to db");
      });
    }
  } catch (error) {
    console.log("error connecting in databse : " + error);
  }
};
start();
