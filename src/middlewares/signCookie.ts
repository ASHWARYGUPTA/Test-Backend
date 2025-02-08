import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const signCookie = (req: Request, res: Response, next: NextFunction) => {
  try {
    const dataToSign = req.body.dataToSign;
    if (!process.env.JWT_SECRET) {
      res.status(403).json({
        message: "JWT SECRET NOT AVAILABLE UPDATE ENV FILE",
        value: false,
      });
      return;
    }

    const token = jwt.sign(dataToSign, process.env.JWT_SECRET);
    res.cookie("token", token, {
      secure: true,
      expires: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    });

    next();
  } catch (error) {
    res.status(400).json({
      message: "Unkown Error Occured at signCookies",
      value: false,
      error,
    });
  }
};

export default signCookie;
