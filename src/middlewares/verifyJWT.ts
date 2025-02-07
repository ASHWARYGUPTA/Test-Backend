import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.body.token;
    if (!process.env.JWT_SECRET) return;
    try {
      const verify = jwt.verify(token, process.env.JWT_SECRET);
      //   console.log("verify", verify);
      //@ts-ignore
      if (verify._id) {
        //@ts-ignore
        req.body._id = verify._id;
        // console.log(req.body._id);
        next();
      }
    } catch (error) {
      res.status(400).json({
        message: "Error In Signing JWT",
        value: false,
        error,
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "Unkown Error Occured at VerifyJWT",
      value: false,
      error,
    });
  }
};

export default verifyJWT;
