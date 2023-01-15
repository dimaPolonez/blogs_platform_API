import jwt from 'jsonwebtoken';
import {ObjectId} from "mongodb";
import {settings} from "../data/db.data";
import {tokenObjectType} from "../models/data.models";
class jwtApp {

    async createJwt(user: tokenObjectType) {
        debugger
        const token = jwt.sign({userId: user._id}, settings.JWT_SECRET,{expiresIn: '1h'});

        return { accessToken: token }
    }

    async verifyJwt(token: string) {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)

            return result.userId
        } catch (e) {
            return null
        }
    }

}

export default new jwtApp();