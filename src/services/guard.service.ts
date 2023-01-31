import {ObjectId} from "mongodb";
import {ACTIVE_DEVICE, ERRORS_CODE} from "../data/db.data";
import {activeDeviceBDType, deviceInfoObject, returnActiveDevice} from "../models/activeDevice.models";
import { userBDType } from "../models/user.models";


class guardService {

    async addNewDevice(userId: ObjectId, deviceInfo: deviceInfoObject, expiresTime: string):
        Promise<ObjectId>
        {
            const dateNow: string = new Date().toString();

            const deviceId = await ACTIVE_DEVICE.insertOne({
                _id: new ObjectId(),
                userId: userId,
                ip: deviceInfo.ip,
                title: deviceInfo.title,
                lastActiveDate: dateNow,
                expiresTime: expiresTime
            })

            return deviceId.insertedId
    }

    async allActiveDevice(sessionId: ObjectId):
    Promise<returnActiveDevice []>
    {
        const idObject: ObjectId = new ObjectId(sessionId);

        const allActiveDevice: activeDeviceBDType [] = await ACTIVE_DEVICE.find({_id: idObject}).toArray();

        const returnObject: returnActiveDevice [] = allActiveDevice.map((field: activeDeviceBDType) => {
            return {
                deviceId: field._id,
                ip: field.ip,
                lastActiveDate: field.lastActiveDate,
                title: field.title
            }
        })
        return returnObject
    }

    async checkedActiveSession(sessionId: ObjectId):
    Promise<boolean>
    {

        const idObject: ObjectId = new ObjectId(sessionId);

        const findActiveSession: activeDeviceBDType [] = await ACTIVE_DEVICE.find({_id: idObject}).toArray();

        if (findActiveSession.length === 0) {
            return false
        } else {
            return true
        }

    }

    async killAllSessions(userObject: userBDType){

        await ACTIVE_DEVICE.deleteMany({userId: userObject._id})
    }

    async killOneSession(sessionId: ObjectId, userObject: userBDType):
    Promise<number>
    {
        const idObject: ObjectId = new ObjectId(sessionId);
        
        const findDevice: activeDeviceBDType [] = await ACTIVE_DEVICE.find({_id: idObject}).toArray();

        if (findDevice.length === 0) {
            return ERRORS_CODE.NOT_FOUND_404
        }

        const bearer: boolean [] = findDevice.map((field: activeDeviceBDType) => {
            if (field.userId.toString() === userObject._id.toString()) {
                return true
            } else {
                return false
            }
        })

        if (!bearer[0]) {
            return ERRORS_CODE.NOT_YOUR_OWN_403
        }

        await ACTIVE_DEVICE.deleteOne({_id: idObject})

        return ERRORS_CODE.NO_CONTENT_204;
    }

}

export default new guardService();