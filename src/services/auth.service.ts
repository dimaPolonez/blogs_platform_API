import {ObjectId} from "mongodb";
import bcryptApplication from "../application/bcrypt.application";
import {USERS} from "../data/db.data";
import {authParams, authReqType} from "../models/auth.models";
import {userBDType, userReqType} from "../models/user.models";
import {isAfter} from "date-fns";


class authService {

    async auth(body: authReqType):
        Promise<false | userBDType> {

        const findName: userBDType [] = await USERS.find(
            {
                $or: [
                    {"infUser.login": new RegExp(body.loginOrEmail, 'gi')},
                    {"infUser.email": new RegExp(body.loginOrEmail, 'gi')}
                ]
            })
            .toArray();

        if (findName.length === 0) {
            return false
        }

        const checkConfirm: boolean [] = findName.map((f) => f.authUser.confirm);

        if (checkConfirm[0] === false) {
            return false
        }

        const hushPassDB: string [] = findName.map((f) => f.authUser.hushPass);

        const result: boolean = await bcryptApplication.hushCompare(body.password, hushPassDB[0]);

        if (!result) {
            return false
        }

        return findName[0]
    }

    async confirm(user: userBDType, authParams: authParams) {

        await USERS.updateOne({_id: user._id}, {
            $set: {
                authUser: {confirm: authParams.confirm, hushPass: user.authUser.hushPass},
                activeUser: {
                    codeActivated: authParams.codeActivated,
                    lifeTimeCode: authParams.lifeTimeCode
                }
            }
        });

    }

    async getOne(bodyID: ObjectId):
        Promise<false | userBDType> {

        const find: userBDType [] = await USERS.find({_id: bodyID}).toArray();

        if (find.length === 0) {
            return false;
        }

        return find[0]
    }

    async checkUnique(userReg: userReqType):
        Promise<boolean> {

        const find: userBDType [] = await USERS.find(
            {
                $or: [
                    {"infUser.login": new RegExp(userReg.login, 'gi')},
                    {"infUser.email": new RegExp(userReg.email, 'gi')}
                ]
            }
        ).toArray();

        if (find.length === 0) {
            return true;
        }
        return false
    }

    async checkCode(code: string):
        Promise<userBDType | false> {

        const find: userBDType [] = await USERS.find({"activeUser.codeActivated": code}).toArray();

        if (find.length === 0) {
            return false;
        }

        const result: boolean [] = find.map((f: userBDType) => {
            const nowDate = new Date();

            const date = Date.parse(f.activeUser.lifeTimeCode)

            return isAfter(date, nowDate)
        });

        if (!result[0]) {
            return false
        } else {
            return find[0]
        }
    }

    async checkEmail(email: string):
        Promise<string | false> {

        const find: userBDType [] = await USERS.find({"infUser.email": email}).toArray();

        if (find.length === 0) {
            return false;
        }

        const result: string [] = find.map((f: userBDType) => f.activeUser.codeActivated);

        if(result[0] === 'Activated') {
            return false
        }

        return result[0]
    }
}

export default new authService();