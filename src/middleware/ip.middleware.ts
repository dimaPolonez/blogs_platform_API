import {Request, Response, NextFunction} from "express";
import {ERRORS_CODE} from "../core/db.data";
import IpService from "../helpers/ip.service";

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