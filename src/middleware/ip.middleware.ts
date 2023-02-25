import {Request, Response, NextFunction} from "express";
import {ERRORS_CODE} from "../data/db.data";
import {ipService} from "../services/ip.service";

export const ipBanner = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let ipPath: string = req.ip + req.path

    let findIp: boolean = await ipService.findIP(ipPath)

    if (findIp) {
        next()
        return
    }

    res.sendStatus(ERRORS_CODE.TOO_MANY_REQUEST_429)
}