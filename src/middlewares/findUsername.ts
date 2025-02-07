import { NextFunction, Request, Response } from "express";
import userModel from "../schema/SignUpSchema";

const findUsername = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const username = req.body.username;
    const data = await userModel.findOne({
      username,
    });
    if (!data) {
      res.status(400).json({
        message: "Invalid Username",
        value: false,
      });
      return;
    }
    if (!data.password) {
      res.status(400).json({
        message: "No Password Available",
        value: false,
      });
      return;
    }
    req.body.data = data;
    next();
  } catch (error) {
    res.status(400).json({
      message: "Unkown Error Occured At findUsername",
      value: false,
      error,
    });
  }
};

export default findUsername;
