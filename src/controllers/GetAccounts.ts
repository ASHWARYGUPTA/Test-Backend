import cookieParser from "cookie-parser";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import getToken from "../middlewares/getToken";
import validateJWT from "../middlewares/validateJWT";
import verifyJWT from "../middlewares/verifyJWT";
import AccountInfoModel from "../schema/AccountInfo";
dotenv.config();

const router = express.Router();

router.use(express.json());
router.use(cookieParser());
// router.use(
//   cors({
//     origin: "http://localhost:3000", // Your frontend URL
//     methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
//     credentials: true, // Include credentials if needed (e.g., cookies)
//   })
// );

router.get("/", getToken, validateJWT, verifyJWT, async (req, res) => {
  try {
    const response = await AccountInfoModel.find({
      userId: req.body._id,
    });

    res.status(200).json({
      message: "Data Fetched",
      value: true,
      response,
    });
  } catch (error) {
    res.status(400).json({
      message: "Unkown Error Occured At GetAccounts",
      value: false,
      error,
    });
  }
});

//@ts-ignore
router.delete("/delete", getToken, validateJWT, verifyJWT, async (req, res) => {
  try {
    if (!req.headers["delete_id"]) {
      return res.status(400).json({
        message: "No Id Sent",
        value: false,
      });
    }
    console.log("delete_id: ", req.headers["delete_id"]);
    await AccountInfoModel.findByIdAndDelete(req.headers["delete_id"]);
    res.status(200).json({
      message: "Deleted Successfully",
      value: true,
    });
  } catch (error) {
    res.status(400).json({
      message: "Unkown Error Occured At Deleting Data",
      value: false,
      error,
    });
  }
});

export default router;
