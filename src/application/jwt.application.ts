import jwt from 'jsonwebtoken';
import {settings} from "../data/db.data";
import {tokensObjectType} from '../models/auth.models';
import {ObjectId} from "mongodb";
import {deviceInfoObject, returnRefreshObject} from "../models/session.models";
import GuardService from "../services/guard.service";
import {add} from 'date-fns';
import { userService } from '../services/user.service';

class JwtApp {

    public async createAccessJwt(userID: ObjectId): 
        Promise<tokensObjectType> 
    {                                            
        const accessToken: string = jwt.sign({userId: userID}, settings.JWT_SECRET, {expiresIn: 540})

        return {
            accessToken: accessToken,
        }
    }

    public async createRefreshJwt(userID: ObjectId, deviceInfoObject: deviceInfoObject):
        Promise<string> 
    {                                
        const expiresBase: number = 5400

        const expiresTime: string = add(new Date(), {
            seconds: expiresBase
        }).toString()

        const deviceId: ObjectId = await GuardService.addNewDevice(userID, deviceInfoObject, expiresTime)

        const refreshToken: string = jwt.sign({
                                                deviceId: deviceId,
                                                userId: userID
                                            }, settings.JWTREFRESH_SECRET, {expiresIn: expiresBase})

        return refreshToken
    }

    public async updateRefreshJwt(userID: ObjectId, deviceInfoObject: deviceInfoObject, sessionId: ObjectId):
        Promise<string> 
    {
        const deviceId: ObjectId = new ObjectId(sessionId)

        const expiresBase: number = 5400

        const expiresTime: string = add(new Date(), {
            seconds: expiresBase
        }).toString()

        await GuardService.updateExpiredSession(deviceId, deviceInfoObject, expiresTime)

        const refreshToken: string = jwt.sign({
                                                deviceId: deviceId,
                                                userId: userID
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
                userId: validAccess.userId.string,
                sessionId: validAccess.deviceId.string
            }

            const checkedActiveSession: boolean = await userService.checkedActiveSession(refreshObject)

            if (!checkedActiveSession) {
                return null
            }

            return refreshObject
        
        } catch (e) {
            return null
        }
    }
}

export const jwtApp = new JwtApp()