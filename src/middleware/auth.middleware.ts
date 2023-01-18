import { Request, Response, NextFunction } from "express";
import { header, validationResult } from "express-validator";
import { ObjectId } from "mongodb";
import jwtApplication from "../application/jwt.application";
import { ERRORS_CODE, SUPERADMIN } from "../data/db.data";
import userService from "../services/user.service";


export const basicAuthorization = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const errors = validationResult(req);
    header('authorization')
      .isString()
      .bail()
      .trim()
      .bail()
      .notEmpty()
      .bail()
      .withMessage('Field authorization incorrect');
  
    if (
      req.headers.authorization !== `Basic ${SUPERADMIN[0].logPass}` ||
      !errors.isEmpty()
    ) {
      res.status(401).json('Unauthorized');
    } else {
      next();
    }
  };
  
export const bearerAuthorization = async (
      req: Request,
      res: Response,
      next: NextFunction
  ) => {
  
    if (!req.headers.authorization) {
      res.status(ERRORS_CODE.UNAUTHORIZED_401).json('Unauthorized');
      return
    }
  
    const token: string = req.headers.authorization!.substring(7)
  
    const result = await jwtApplication.verifyJwt(token);
  
    if (result) {
      const getId: ObjectId = new ObjectId(result)
      req.user = await userService.getOne(getId);
      next();
      return
    }
  
    res.status(ERRORS_CODE.UNAUTHORIZED_401).json('Unauthorized');
  
  }