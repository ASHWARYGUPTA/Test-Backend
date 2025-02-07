import { NextFunction, Request, Response } from "express";
import { userSignUpZod } from "../schema/zodSchema";

const parseSignUp = (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = userSignUpZod.safeParse(req.body);
    if (data.success) {
      next();
    } else {
      res.status(400).json({
        message: "Error Occured While Parsing Zod",
        value: false,
        error: data,
      });
      return;
    }
  } catch (error) {
    res.status(400).json({
      message: "Unkown Error Occured at parseZod",
      value: false,
      error,
    });
  }
};

export default parseSignUp;
