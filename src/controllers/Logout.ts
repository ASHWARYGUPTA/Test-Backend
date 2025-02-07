import cookieParser from "cookie-parser";
import express from "express";
import dotenv from "dotenv";
import getToken from "../middlewares/getToken";
import validateJWT from "../middlewares/validateJWT";
import verifyJWT from "../middlewares/verifyJWT";
dotenv.config();

const router = express.Router();

router.use(express.json());
router.use(cookieParser());

router.get("/", getToken, validateJWT, verifyJWT, async (req, res) => {
  try {
    res.cookie("token", "none", {
      expires: new Date(Date.now() + 1 * 1000),
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.status(200).json({
      value: true,
      message: "Logged Out Successfully",
    });
  } catch (err) {
    res.status(400).json({
      value: false,
      message: "Unkown Error Occured",
      err: err,
    });
  }
});

export default router;
