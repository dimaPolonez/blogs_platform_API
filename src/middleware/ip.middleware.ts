import {Request, Response, NextFunction} from "express";
import {ERRORS_CODE} from "../data/db.data";
import IpService from "../services/ip.service";

export const ipBanner = async (
    req: Request,
    res: Response,
    next: NextFunction
) => 
{
    let ipPath: string = req.ip + req.path

    let findIp: boolean = await IpService.findIP(ipPath)

    if (findIp) {
        next()
        return
    }

    res.sendStatus(ERRORS_CODE.TOO_MANY_REQUEST_429)
}