import express, { Router } from "express";
import userModel from "../schema/SignUpSchema";
import cors from "cors";
import parseSignUp from "../middlewares/parseZod";
import { hash } from "bcrypt";

const router: Router = express.Router();

router.use(express.json());

router.post("/", parseSignUp, async (req, res) => {
  try {
    const { name, username, password, email } = req.body;
    const genPass = await hash(password, 10);
    await userModel.create({
      name,
      username,
      password: genPass,
      email,
    });
    res.status(200).json({
      message: "Sign Up Successfull",
      value: true,
    });
  } catch (error) {
    res.status(403).json({
      message: "Error Occured While Parsing or Uploading data to DB",
      value: false,
      error,
    });
  }
});

export default router;
