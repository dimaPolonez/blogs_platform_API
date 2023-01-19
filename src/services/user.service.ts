import {USERS} from "../data/db.data";
import {ObjectId} from "mongodb";
import bcryptApplication from "../application/bcrypt.application";
import {userBDType, userObjectResult, userReqType} from "../models/user.models";

class userService {

    async create(body: userReqType, confirmBool: boolean):
        Promise<userObjectResult> {

        const newDateCreated: string = new Date().toISOString();

        const hushPass: string = await bcryptApplication.saltGenerate(body.password)

        const createdUser = await USERS.insertOne({
            _id: new ObjectId(),
            login: body.login,
            email: body.email,
            confirm: confirmBool,
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

        const find: userBDType [] = await USERS.find({_id: bodyID}).toArray();

        if (find.length === 0) {
            return false;
        }

        await USERS.deleteOne({_id: bodyID});

        return true;
    }

    
}

export default new userService();
