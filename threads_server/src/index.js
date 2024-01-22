import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/DB.config.js";
import cookieParser from "cookie-parser";
import UserRouter from "./routes/user.route.js";
import PostRouter from "./routes/post.route.js";
import { v2 as cloudinary } from "cloudinary";
const app = express();
dotenv.config();

const port = process.env.PORT || 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  return res.json({ message: "Hello world" });
});

app.use("/api/user", UserRouter);
app.use("/api/post", PostRouter);
connectDB()
  .then(
    app.listen(port, () => {
      console.log(`Server is listening at port http://localhost:${port}`);
    })
  )
  .catch((err) => {
    console.log(err);
  });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
