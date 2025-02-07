import { NextFunction, Request, Response } from "express";

const validateJWT = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!process.env.JWT_SECRET) {
      res.status(400).json({
        message: "JWT NOT AVAILABLE",
        value: false,
      });
      return;
    } else {
      next();
    }
  } catch (error) {
    res.status(400).json({
      message: "Unkown Error Occured at validatingJWT",
      value: false,
      error,
    });
  }
};

export default validateJWT;
