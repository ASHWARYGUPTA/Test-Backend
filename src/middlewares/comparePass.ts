import { NextFunction, Request, Response } from "express";
import userModel from "../schema/SignUpSchema";
import bcrypt from "bcrypt";

const comparePass = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body.data;
    const username = req.body.username;
    const compare = await bcrypt.compare(req.body.password, data.password);
    if (compare) {
      await userModel.findByIdAndUpdate(data._id, {
        isSignedIn: true,
      });

      const dataToSign = {
        _id: data._id,
        username,
      };

      req.body.dataToSign = dataToSign;
      next();
    }
  } catch (error) {
    res.status(400).json({
      message: "Unkown Error Occured At Compare Password",
      value: false,
      error,
    });
  }
};

export default comparePass;
