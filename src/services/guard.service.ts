import {ObjectId} from "mongodb";
import {ACTIVE_DEVICE, ERRORS_CODE} from "../data/db.data";
import {activeDeviceBDType, deviceInfoObject, returnActiveDevice} from "../models/activeDevice.models";
import { userBDType } from "../models/user.models";


class guardService {

    async addNewDevice(userId: ObjectId, deviceInfo: deviceInfoObject, expiresTime: string):
        Promise<string>
        {
            const dateNow: string = new Date().toString();

            let deviceIdNum: number = await ACTIVE_DEVICE.countDocuments({userId: userId});

            let deviceIdStr: string = (deviceIdNum++).toString()

            await ACTIVE_DEVICE.insertOne({
                _id: new ObjectId(),
                userId: userId,
                ip: deviceInfo.ip,
                title: deviceInfo.title,
                lastActiveDate: dateNow,
                expiresTime: expiresTime,
                deviceId: deviceIdStr
            })
            return deviceIdStr
    }

    async allActiveDevice(userObject: userBDType):
    Promise<returnActiveDevice []>
    {
        const allActiveDevice: activeDeviceBDType [] = await ACTIVE_DEVICE.find({userId: userObject._id}).toArray();

        const returnObject: returnActiveDevice [] = allActiveDevice.map((field: activeDeviceBDType) => {
            return {
                ip: field.ip,
                title: field.title,
                lastActiveDate: field.lastActiveDate,
                deviceId: field.deviceId
            }
        })
        return returnObject
    }

    async killAllSessions(userObject: userBDType){

        await ACTIVE_DEVICE.deleteMany({userId: userObject._id})
    }

    async killOneSession(bodyID: string, userObject: userBDType):
    Promise<number>
    {
        
        const findDevice: activeDeviceBDType [] = await ACTIVE_DEVICE.find({
            $and: [
            {deviceId: bodyID},
            {userId: userObject._id}
        ]}).toArray();

        if (findDevice.length === 0) {
            return ERRORS_CODE.NOT_FOUND_404
        }

        await ACTIVE_DEVICE.deleteOne({
            $and: [
            {deviceId: bodyID},
            {userId: userObject._id}
        ]})

        return ERRORS_CODE.NO_CONTENT_204;
    }

}

export default new guardService();