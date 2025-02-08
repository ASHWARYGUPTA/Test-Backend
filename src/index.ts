import express, { Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
import SignUpRouter from "./controllers/SignUp";
import SignInRouter from "./controllers/SignIn";
import UploadRouter from "./controllers/UploadFile";
import GetAccounts from "./controllers/GetAccounts";
import LogoutRouter from "./controllers/Logout";

const connectDb = async () => {
  if (!process.env.MOONGOOSE_STRING) {
    console.log("MOONGOSE STRING NOT PRESENT IN ENV");
    return;
  }
  await mongoose.connect(process.env.MOONGOOSE_STRING).then(() => {
    console.log("Connected to DB Successfully");
  });
};

const app = express();
connectDb();

app.use(
  cors({
    origin: "https://test-frontend-olive.vercel.app", // Your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
    credentials: true, // Include credentials if needed (e.g., cookies)
  })
);

app.use("/signup", SignUpRouter);
app.use("/signin", SignInRouter);
app.use("/upload", UploadRouter);
app.use("/getAccounts", GetAccounts);
app.use("/logout", LogoutRouter);

app.listen(process.env.PORT, (error) => {
  if (!error) {
    console.log("Listing on port");
  } else {
    console.log(error);
  }
});
