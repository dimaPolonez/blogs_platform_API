import {queryAuthUser, requestBodyUser, typeBodyID} from "../models/request.models";
import {USERS} from "../data/db.data";
import {ObjectId} from "mongodb";
import bcrypt from "bcrypt";



async function saltPassGenerate(password: string) {

    const salt = await bcrypt.genSalt(10);

    const hush = await hashPassGenerate(password, salt);

    return hush
}

async function hashPassGenerate(password: string, saltPass: string) {

    const hush = await bcrypt.hash(password, saltPass);

    return hush
}

async function hashPassCompare(password: string, hush: string) {

    const result = await bcrypt.compare(password, hush);

    return result
}

class userService {

    async create(body: requestBodyUser) {

        const newDateCreated = new Date().toISOString();

        const hushPass = await saltPassGenerate(body.password)

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

    async auth(body: queryAuthUser) {

        const findName = await USERS.find(
            {
                login: new RegExp(body.loginOrEmail,'gi'),
                email: new RegExp(body.loginOrEmail,'gi')})
                .toArray();

        if (findName.length === 0) {
            return false
        }

        const hushPassDB = findName.map((f) => f.hushPass);

        const result = await hashPassCompare(body.password,hushPassDB[0]);

        if (!result) {
            return false
        }

        return true
    }
}

export default new userService();
