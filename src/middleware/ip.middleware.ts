import { Request, Response, NextFunction } from "express";
import { ERRORS_CODE } from "../data/db.data";
import ipService from "../services/ip.service";

export const ipBanner = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const endPoint: string = (req.path).slice(1);

    let ipPath: string = req.ip + req.path;

    let result: boolean = await ipService.find(ipPath);

    if (result) {
        next();
        return
    } else {
        res.sendStatus(ERRORS_CODE.TOO_MANY_REQUEST_429)
    }

};