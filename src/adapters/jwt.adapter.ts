import {settings} from "../core/db.data";
import {ObjectId} from "mongodb";
import {ReturnRefreshObjectType} from "../core/models";
import SessionsService from "../auth/sessions/application/sessions.service";
import jwt from "jsonwebtoken";

class JwtApp {

    public async createAccessJwt(
        userId: ObjectId,
    ):Promise<string> {
        return await jwt.sign({userId: userId}, settings.JWT_SECRET, {expiresIn: 540})
    }

    public async createRefreshJwt(
        userId: ObjectId,
        deviceId: ObjectId,
        expiresBase: number
    ):Promise<string>{
        return jwt.sign({
            deviceId: deviceId,
            userId: userId
        }, settings.JWTREFRESH_SECRET, {expiresIn: expiresBase})
    }

    public async verifyAccessJwt(
        token: string
    ):Promise<ObjectId | null>{
        try {
            const validAccess: any = jwt.verify(token, settings.JWT_SECRET)

            return validAccess.userId

        } catch (e) {
            return null
        }
    }

    public async verifyRefreshJwt(
        token: string
    ):Promise<ReturnRefreshObjectType | null>{
        try {
            const validAccess: any = jwt.verify(token, settings.JWTREFRESH_SECRET)

            const refreshObject: ReturnRefreshObjectType = {
                userId: validAccess.userId,
                sessionId: validAccess.deviceId
            }

            const checkedActiveSession: boolean = await SessionsService.checkedActiveSession(refreshObject.sessionId)

            if (!checkedActiveSession) {
                return null
            }

            return refreshObject
        
        } catch (e) {
            return null
        }
    }
}

export default new JwtApp()