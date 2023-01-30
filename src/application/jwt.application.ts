import jwt from 'jsonwebtoken';
import {ACTIVE_DEVICE, settings} from "../data/db.data";
import {tokensObjectType} from '../models/auth.models';
import {userBDType} from '../models/user.models';
import {ObjectId} from "mongodb";
import {deviceInfoObject} from "../models/activeDevice.models";
import guardService from "../services/guard.service";

class jwtApp {

    public async createAccessJwt(user: userBDType): Promise<tokensObjectType> {

        const accessToken: string = jwt.sign({userId: user._id}, settings.JWT_SECRET, {expiresIn: 10});

        const objToken: tokensObjectType = {
            accessToken: accessToken,
        }

        return objToken
    }

    public async createRefreshJwt(user: userBDType, deviceInfoObject: deviceInfoObject):
        Promise<string> {

        const expiresTime: number = 20;

        const deviceId: number = await guardService.addNewDevice(user._id, deviceInfoObject, expiresTime);

        const refreshToken: string = jwt.sign({deviceId: deviceId}, settings.JWTREFRESH_SECRET, {expiresIn: expiresTime});



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
        Promise<ObjectId | null> {
        try {
            const result: any = jwt.verify(token, settings.JWTREFRESH_SECRET)

            return result.userId
        } catch (e) {
            return null
        }
    }
}

export default new jwtApp();