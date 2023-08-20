import {ObjectId} from "mongodb";
import {ACTIVE_DEVICE} from "../../../core/db.data";
import {ActiveDeviceBDType} from "../../../core/models";


class SessionsRepository {

    async findOne(
        sessionId: ObjectId
    ):Promise<ActiveDeviceBDType | null>{
       return await ACTIVE_DEVICE.findOne({_id: sessionId})
    }

    async deleteOne(
        sessionId: ObjectId
    ){
        await ACTIVE_DEVICE.deleteOne({_id: sessionId})
    }

    async deleteAllSessions(
        sessionId: ObjectId,
        userId: ObjectId
    ){
        await ACTIVE_DEVICE.deleteMany({
            $and: [
                {_id: {$ne: sessionId}},
                {userId: new ObjectId(userId)}
            ]
        })
    }
}

export default new SessionsRepository()