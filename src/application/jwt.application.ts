import jwt from 'jsonwebtoken';
import {settings} from "../data/db.data";
import {tokenObjectType} from '../models/auth.models';
import {userBDType} from '../models/user.models';

class jwtApp {

    public async createJwt(user: userBDType): Promise<tokenObjectType> {
        const token: string = jwt.sign({userId: user._id}, settings.JWT_SECRET, {expiresIn: '1h'});

        const objToken: tokenObjectType = {
            accessToken: token
        }

        return objToken
    }

    public async verifyJwt(token: string):
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