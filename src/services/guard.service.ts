import {isAfter} from "date-fns";
import {ObjectId} from "mongodb";
import {ACTIVE_DEVICE, ERRORS_CODE} from "../data/db.data";
import {activeDeviceBDType, deviceInfoObject, returnActiveDevice} from "../models/activeDevice.models";
import {userBDType} from "../models/user.models";


class guardService {

    async addNewDevice(userId: ObjectId, deviceInfo: deviceInfoObject, expiresTime: string):
        Promise<ObjectId> {
        const dateNow: string = new Date().toISOString();

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

    async allActiveDevice(userId: ObjectId):
        Promise<returnActiveDevice []> {
        const idUser: ObjectId = new ObjectId(userId);

        const allActiveDevice: activeDeviceBDType [] = await ACTIVE_DEVICE.find({userId: idUser}).toArray();

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
        Promise<boolean> {

        const idObject: ObjectId = new ObjectId(sessionId);

        const findActiveSession: activeDeviceBDType [] = await ACTIVE_DEVICE.find({_id: idObject}).toArray();

        if (findActiveSession.length === 0) {
            return false
        }

        const result: boolean [] = findActiveSession.map((f: activeDeviceBDType) => {
            const nowDate = new Date();

            const date = Date.parse(f.expiresTime)

            return isAfter(date, nowDate)
        });

        if (!result[0]) {
            return false
        } else {
            return true
        }

    }

    async updateExpiredSession(sessionId: ObjectId, deviceInfoObject: deviceInfoObject, expires: string) {

        const dateNow: string = new Date().toISOString();

        await ACTIVE_DEVICE.updateOne({_id: sessionId}, {
            $set: {
                ip: deviceInfoObject.ip,
                title: deviceInfoObject.title,
                lastActiveDate: dateNow,
                expiresTime: expires
            }
        });
    }

    async killAllSessions(ssesionId: ObjectId, userObject: userBDType) {

        await ACTIVE_DEVICE.deleteMany({
            $and: [
                {_id: {$ne: ssesionId}},
                {userId: userObject._id}
            ]
        })
    }

    async killOneSessionLogout(sessionId: ObjectId) {

        await ACTIVE_DEVICE.deleteOne({_id: sessionId})
    }

    async killOneSession(sessionId: ObjectId, userObject: userBDType):
        Promise<number> {

        const findDevice: activeDeviceBDType [] = await ACTIVE_DEVICE.find({_id: sessionId}).toArray();

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

        await ACTIVE_DEVICE.deleteOne({_id: sessionId})

        return ERRORS_CODE.NO_CONTENT_204;
    }

}

export default new guardService();