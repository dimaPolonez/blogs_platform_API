import { Request, Response, NextFunction } from "express";
import { ERRORS_CODE } from "../data/db.data";
import ipService from "../services/ip.service";

export const ipBanner = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const result: boolean = await ipService.find(req.ip);

    if (result) {
        next()
        return
    }

    res.sendStatus(ERRORS_CODE.TOO_MANY_REQUEST_429);
    return
};