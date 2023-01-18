import {USERS} from "../data/db.data";
import {ObjectId} from "mongodb";
import bcryptApplication from "../application/bcrypt.application";
import {userBDType, userObjectResult, userReqType} from "../models/user.models";
import {authReqType} from "../models/auth.models";

class userService {

    async findUser(bodyID:ObjectId):
        Promise<userBDType []>
    {
        const result: userBDType [] = await USERS.find({_id: bodyID}).toArray();

        return result
    }

    async create(body: userReqType):
        Promise<userObjectResult> {

        const newDateCreated: string = new Date().toISOString();

        const hushPass: string = await bcryptApplication.saltGenerate(body.password)

        const createdUser = await USERS.insertOne({
            _id: new ObjectId(),
            login: body.login,
            email: body.email,
            hushPass: hushPass,
            createdAt: newDateCreated
        });


        let result: userBDType [] = await USERS.find({_id: createdUser.insertedId}).toArray();

        const objResult: userObjectResult [] = result.map((field: userBDType) => {
            return {
                id: field._id,
                login: field.login,
                email: field.email,
                createdAt: field.createdAt
            }
        });

        return objResult[0]
    }

    async delete(bodyID: ObjectId):
        Promise<boolean> {

        const find: userBDType []= await this.findUser(bodyID)

        if (find.length === 0) {
            return false;
        }

        await USERS.deleteOne({_id: bodyID});

        return true;
    }

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

        const hushPassDB: string [] = findName.map((f) => f.hushPass);

        const result: boolean = await bcryptApplication.hushCompare(body.password, hushPassDB[0]);

        if (!result) {
            return false
        }

        return findName[0]
    }

    async getOne(bodyID: ObjectId):
        Promise <false | userBDType>{

        const find: userBDType []= await this.findUser(bodyID)

        if (find.length === 0) {
            return false;
        }

        return find[0]
    }
}

export default new userService();
