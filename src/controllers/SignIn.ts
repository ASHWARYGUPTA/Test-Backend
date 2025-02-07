import cookieParser from "cookie-parser";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import findUsername from "../middlewares/findUsername";
import comparePass from "../middlewares/comparePass";
import signCookie from "../middlewares/signCookie";
import getToken from "../middlewares/getToken";
import validateJWT from "../middlewares/validateJWT";
import verifyJWT from "../middlewares/verifyJWT";

const router = express.Router();

router.use(express.json());
router.use(cookieParser());

router.post("/", findUsername, comparePass, signCookie, async (req, res) => {
  res.status(200).json({
    message: "Correct Credentials",
    value: true,
  });
});

router.get(
  "/isSignedIn",
  getToken,
  validateJWT,
  verifyJWT,
  async (req, res) => {
    res.status(200).json({
      message: "Verified Successfully",
      value: true,
    });
  }
);

export default router;
