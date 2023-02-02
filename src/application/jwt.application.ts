import jwt from 'jsonwebtoken';
import {settings} from "../data/db.data";
import {tokensObjectType} from '../models/auth.models';
import {userBDType} from '../models/user.models';
import {ObjectId} from "mongodb";
import {deviceInfoObject, returnRefreshObject} from "../models/activeDevice.models";
import guardService from "../services/guard.service";
import { add } from 'date-fns';

class jwtApp {

    public async createAccessJwt(user: userBDType): Promise<tokensObjectType> {

        const accessToken: string = jwt.sign({userId: user._id}, settings.JWT_SECRET, {expiresIn: 1000});

        const objToken: tokensObjectType = {
            accessToken: accessToken,
        }

        return objToken
    }

    public async createRefreshJwt(user: userBDType, deviceInfoObject: deviceInfoObject):
        Promise<string> {

        const expiresBase: number = 20; 

        const expiresTime: string = add(new Date(), {
            seconds: expiresBase
        }).toString();

        const deviceId: ObjectId = await guardService.addNewDevice(user._id, deviceInfoObject, expiresTime);

        const refreshToken: string = jwt.sign({deviceId: deviceId, userId: user._id}, settings.JWTREFRESH_SECRET, {expiresIn: expiresBase});

        return refreshToken
    }

    public async updateRefreshJwt(user: userBDType, deviceInfoObject: deviceInfoObject, sessionId: ObjectId):
    Promise<string> {

    const deviceId: ObjectId = new ObjectId(sessionId);

    const expiresBase: number = 20; 

    const expiresTime: string = add(new Date(), {
        seconds: expiresBase
    }).toString();

    await guardService.updateExpiredSession(deviceId, deviceInfoObject, expiresTime);

    const refreshToken: string = jwt.sign({deviceId: deviceId, userId: user._id}, settings.JWTREFRESH_SECRET, {expiresIn: expiresBase});

    return refreshToken
}

    public async verifyAccessJwt(token: string):
        Promise<ObjectId | null> {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)

            return result.userId
        } catch (e) {
            return null
        }
    }

    public async verifyRefreshJwt(token: string):
        Promise<returnRefreshObject | null> {
        try {

            const result: any = jwt.verify(token, settings.JWTREFRESH_SECRET)

            const refreshObject: returnRefreshObject = {
                userId: result.userId,
                sessionId: result.deviceId
            }

            const checkedActiveSession: boolean = await guardService.checkedActiveSession(refreshObject.sessionId);

            if (checkedActiveSession) {
                return refreshObject
            }
            
            return null

        } catch (e) {
            return null
        }
    }
}

export default new jwtApp();