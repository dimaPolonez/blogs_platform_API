import { ObjectId } from "mongodb";
import bcryptApplication from "../application/bcrypt.application";
import { USERS } from "../data/db.data";
import { authReqType } from "../models/auth.models";
import { userBDType} from "../models/user.models";


class authService {

    async auth(body: authReqType):
        Promise<false | userBDType> {

        const findName: userBDType [] = await USERS.find(
            {
                $or: [
                    {login: new RegExp(body.loginOrEmail, 'gi')},
                    {email: new RegExp(body.loginOrEmail, 'gi')}
                ]
            })
            .toArray();

        if (findName.length === 0) {
            return false
        }

        const checkConfirm: boolean [] = findName.map((f) => f.confirm);

        if (checkConfirm[0] === false) {
            return false
        }

        const hushPassDB: string [] = findName.map((f) => f.hushPass);

        const result: boolean = await bcryptApplication.hushCompare(body.password, hushPassDB[0]);

        if (!result) {
            return false
        }

        return findName[0]
    }

    async confirm(user: userBDType){

        await USERS.updateOne({_id: user._id}, {
            $set: {
                confirm: true
            }
        });

    }

    async getOne(bodyID: ObjectId):
        Promise <false | userBDType>{

        const find: userBDType [] = await USERS.find({_id: bodyID}).toArray();

        if (find.length === 0) {
            return false;
        }

        return find[0]
    }
}

export default new authService();