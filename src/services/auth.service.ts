import {ObjectId} from "mongodb";
import bcryptApplication from "../application/bcrypt.application";
import {USERS} from "../data/db.data";
import {authParams, authReqType} from "../models/auth.models";
import {userBDType} from "../models/user.models";


class authService {

    async auth(body: authReqType):
        Promise<false | userBDType> {

        const findName: userBDType [] = await USERS.find(
            {
                $or: [
                    {"infUser.login": body.loginOrEmail},
                    {"infUser.email": body.loginOrEmail}
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

    async getOneToCode(code: string):
        Promise<userBDType> {

        const find: userBDType [] = await USERS.find({"activeUser.codeActivated": code}).toArray();

        return find[0]
    }

    async getOneToEmail(email: string):
        Promise<userBDType> {

        const find: userBDType [] = await USERS.find({"infUser.email": email}).toArray();

        return find[0]
    }


}

export default new authService();