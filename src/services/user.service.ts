import {BLOGS, ERRORS_CODE, USERS} from "../data/db.data";
import {ObjectId} from "mongodb";
import bcryptApplication from "../application/bcrypt.application";
import {usersFieldsType} from "../models/data.models";
import { userBDType } from "../models/user.models";
import { authReqType } from "../models/auth.models";

class userService {

    async create(body: requestBodyUser) {

        const newDateCreated = new Date().toISOString();

        const hushPass = await bcryptApplication.saltGenerate(body.password)

        const createdUser = await USERS.insertOne({
            _id: new ObjectId(),
            login: body.login,
            email: body.email,
            hushPass: hushPass,
            createdAt: newDateCreated
        });


        let result = await USERS.find({_id: createdUser.insertedId}).toArray();

        const objResult = result.map((field) => {
            return {
                id: field._id,
                login: field.login,
                email: field.email,
                createdAt: field.createdAt
            }
        });

        return objResult[0]
    }

    async delete(bodyID: typeBodyID) {
        if (!bodyID) {
            throw new Error('не указан ID');
        }
        const result = await USERS.find({_id: bodyID}).toArray()

        if (result.length === 0) {
            return false;
        }

        await USERS.deleteOne({_id: bodyID});

        return true;
    }

    async auth(body: authReqType) :
    Promise <false | userBDType>
    {

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

    async getOne(userId: typeBodyID) {

        const user = await USERS.find({ _id: userId }).toArray();

        return user[0]
    }
}

export default new userService();
