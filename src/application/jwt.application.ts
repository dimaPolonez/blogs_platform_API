import jwt from 'jsonwebtoken';
import {settings} from "../data/db.data";
import {tokensObjectType} from '../models/auth.models';
import {userBDType} from '../models/user.models';
import {ObjectId} from "mongodb";
import {deviceInfoObject, returnRefreshObject} from "../models/activeDevice.models";
import GuardService from "../services/guard.service";
import {add} from 'date-fns';

class JwtApp {

    public async createAccessJwt(user: userBDType): 
        Promise<tokensObjectType> 
    {
        const accessToken: string = jwt.sign({userId: user._id}, settings.JWT_SECRET, {expiresIn: 540})

        return {
            accessToken: accessToken,
        }
    }

    public async createRefreshJwt(user: userBDType, deviceInfoObject: deviceInfoObject):
        Promise<string> 
    {
        const expiresBase: number = 5400

        const expiresTime: string = add(new Date(), {
            seconds: expiresBase
        }).toString()

        const deviceId: ObjectId = await GuardService.addNewDevice(user._id, deviceInfoObject, expiresTime)

        const refreshToken: string = jwt.sign({
                                                deviceId: deviceId,
                                                userId: user._id
                                            }, settings.JWTREFRESH_SECRET, {expiresIn: expiresBase})

        return refreshToken
    }

    public async updateRefreshJwt(user: userBDType, deviceInfoObject: deviceInfoObject, sessionId: ObjectId):
        Promise<string> 
    {
        const expiresBase: number = 5400

        const expiresTime: string = add(new Date(), {
            seconds: expiresBase
        }).toString()

        await GuardService.updateExpiredSession(sessionId, deviceInfoObject, expiresTime)

        const refreshToken: string = jwt.sign({
                                                deviceId: sessionId,
                                                userId: user._id
                                            }, settings.JWTREFRESH_SECRET, {expiresIn: expiresBase})

        return refreshToken
    }

    public async verifyAccessJwt(token: string):
        Promise<ObjectId | null> 
    {
        try {
            const validAccess: any = jwt.verify(token, settings.JWT_SECRET)

            return validAccess.userId

        } catch (e) {
            return null
        }
    }

    public async verifyRefreshJwt(token: string):
        Promise<returnRefreshObject | null> 
    {
        try {
            const validAccess: any = jwt.verify(token, settings.JWTREFRESH_SECRET)

            const refreshObject: returnRefreshObject = {
                userId: validAccess.userId,
                sessionId: validAccess.deviceId
            }

            const checkedActiveSession: boolean = await GuardService.checkedActiveSession(refreshObject.sessionId)

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