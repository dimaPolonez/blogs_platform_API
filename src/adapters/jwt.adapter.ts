import {settings} from "../core/db.data";
import {ObjectId} from "mongodb";
import {add} from 'date-fns';
import {DeviceInfoObjectType, ReturnRefreshObjectType, TokensObjectType, UserBDType} from "../core/models";
import SessionsService from "../auth/sessions/application/sessions.service";
import jwt from "jsonwebtoken";

class JwtApp {

    public async createAccessJwt(
        user: UserBDType
    ):Promise<TokensObjectType> {
        const accessToken: string = jwt.sign({userId: user._id}, settings.JWT_SECRET, {expiresIn: 540})

        return {
            accessToken: accessToken,
        }
    }

    public async createRefreshJwt(
        user: UserBDType,
        deviceInfoObject: DeviceInfoObjectType
    ):Promise<string>{
        const expiresBase: number = 5400

        const expiresTime: string = add(new Date(), {
            seconds: expiresBase
        }).toString()

        const deviceId: ObjectId = await SessionsService.addNewDevice(user._id, deviceInfoObject, expiresTime)

        return jwt.sign({
            deviceId: deviceId,
            userId: user._id
        }, settings.JWTREFRESH_SECRET, {expiresIn: expiresBase})
    }

    public async updateRefreshJwt(
        user: UserBDType,
        deviceInfoObject: DeviceInfoObjectType,
        sessionId: ObjectId
    ):Promise<string>{
        const deviceId: ObjectId = new ObjectId(sessionId)

        const expiresBase: number = 5400

        const expiresTime: string = add(new Date(), {
            seconds: expiresBase
        }).toString()

        await SessionsService.updateExpiredSession(deviceId, deviceInfoObject, expiresTime)

        return jwt.sign({
            deviceId: deviceId,
            userId: user._id
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