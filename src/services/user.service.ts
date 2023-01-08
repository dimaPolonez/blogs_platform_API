import {queryAuthUser, requestBodyUser, typeBodyID} from "../models/request.models";
import {USERS} from "../data/db.data";
import {ObjectId} from "mongodb";
import bcrypt from "bcrypt";
import {usersFieldsType} from "../models/data.models";

async function hashPassGenerate(password: string, saltPass: string) {
    const hush = await bcrypt.hash(password, saltPass);
    return hush
}

class userService {

    async create(body: requestBodyUser) {

        const newDateCreated = new Date().toISOString();

        const saltPass = await bcrypt.genSalt(100);
        const hushPass = await hashPassGenerate(body.password, saltPass);

        const createdUser = await USERS.insertOne({
            _id: new ObjectId(),
            login: body.login,
            email: body.email,
            saltPass: saltPass,
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

    async auth(body: queryAuthUser) {

        const findName = await USERS.find({
            $or: [
                {name: body.loginOrEmail},
                {email: body.loginOrEmail}
            ]
        }).toArray();

        if (findName.length === 0) {
            return false
        }

        const hushPassDB = findName.map((f) => f.hushPass);
        const saltPass = findName.map((f) => f.saltPass);
        const hushPassUser = await hashPassGenerate(body.password,saltPass[0])

        if (hushPassUser != hushPassDB[0]) {
            return false
        }

        return true
    }
}

export default new userService();
