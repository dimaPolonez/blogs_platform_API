import jwt from 'jsonwebtoken';
import {settings} from "../data/db.data";
import {tokensObjectType} from '../models/auth.models';
import {userBDType} from '../models/user.models';
import {ObjectId} from "mongodb";

class jwtApp {

    public async createAccessJwt(user: userBDType): Promise<tokensObjectType> {

        const accessToken: string = jwt.sign({userId: user._id}, settings.JWT_SECRET, {expiresIn: 10});

        const objToken: tokensObjectType = {
            accessToken: accessToken,
        }

        return objToken
    }

    public async createRefreshJwt(user: userBDType):
        Promise<string> {

        const refreshToken: string = jwt.sign({userId: user._id}, settings.JWTREFRESH_SECRET, {expiresIn: 20});

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