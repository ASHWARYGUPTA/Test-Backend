import { NextFunction, Request, Response } from "express";

const getToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.cookies.token) {
      res.status(400).json({
        message: "No Cookie Found",
        value: false,
      });
      return;
    } else {
      const token = req.cookies.token;
      req.body.token = token;
      next();
    }
  } catch (error) {
    res.status(400).json({
      message: "Unkown Error Occured at getToken",
      value: false,
      error,
    });
  }
};

export default getToken;
