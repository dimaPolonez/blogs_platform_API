import { add } from 'date-fns';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import {REFRESH_TOKENS_ACTIVE, settings} from "../data/db.data";
import {tokensObjectType} from '../models/auth.models';
import {userBDType} from '../models/user.models';

class jwtApp {

    public async createAccessJwt(user: userBDType): Promise<tokensObjectType> {

        const accessToken: string = jwt.sign({userId: user._id}, settings.JWT_SECRET, {expiresIn: 10});
        


        const objToken: tokensObjectType = {
            accessToken: accessToken,
        }

        return objToken
    }

    public async verifyAccessJwt(token: string):
        Promise<any> {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)

            return result.userId
        } catch (e) {
            return null
        }
    }

    public async createRefreshJwt(user: userBDType):
    Promise<string> {

        const refreshToken: string = jwt.sign({userId: user._id}, settings.JWTREFRESH_SECRET, {expiresIn: 20});

        await this.insertToRefreshToken(refreshToken)

        return refreshToken
    }

    private async insertToRefreshToken(refreshToken: string){

        const expiredTime: string = add(new Date(), {
            seconds: 20
        }).toString()

        await REFRESH_TOKENS_ACTIVE.insertOne({
            _id: new ObjectId(),
            token: refreshToken,
            expired: expiredTime
        })
    }

    public async deleteToRefreshToken(refreshToken: string){

        await REFRESH_TOKENS_ACTIVE.deleteOne({token: refreshToken})

    }

    public async verifyRefreshJwt(token: string):
    Promise<any> {
    try {
        const result: any = jwt.verify(token, settings.JWT_SECRET)

        return result.userId
    } catch (e) {
        return null
    }
    }
}

export default new jwtApp();