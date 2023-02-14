import {isAfter} from "date-fns";
import {ObjectId} from "mongodb";
import {ACTIVE_DEVICE, ERRORS_CODE} from "../data/db.data";
import {activeDeviceBDType, deviceInfoObject, returnActiveDevice} from "../models/activeDevice.models";
import {userBDType} from "../models/user.models";


class GuardService {

    public async addNewDevice(userId: ObjectId, deviceInfo: deviceInfoObject, expiresTime: string):
        Promise<ObjectId>
    {
        const newGenerateId: ObjectId = new ObjectId();

        await ACTIVE_DEVICE.insertOne({
                                        _id: newGenerateId,
                                        userId: userId,
                                        ip: deviceInfo.ip,
                                        title: deviceInfo.title,
                                        lastActiveDate: new Date().toISOString(),
                                        expiresTime: expiresTime
                                    })

        return newGenerateId
    }

    public async allActiveDevice(userId: ObjectId):
        Promise<null | returnActiveDevice> 
    {
        const allActiveDevice: null | activeDeviceBDType = await ACTIVE_DEVICE.findOne({userId: userId})

        if (!allActiveDevice) {
            return null
        }

        return {
                    deviceId: allActiveDevice._id,
                    ip: allActiveDevice.ip,
                    lastActiveDate: allActiveDevice.lastActiveDate,
                    title: allActiveDevice.title
                }
    }

    async checkedActiveSession(sessionId: ObjectId):
        Promise<boolean> 
    {
        const findActiveSession: null | activeDeviceBDType = await ACTIVE_DEVICE.findOne({_id: sessionId})

        if (!findActiveSession) {
            return false
        }

        const date = Date.parse(findActiveSession.expiresTime)

        if (isAfter(date, new Date())){
            return false
        }

        return true
    }

    public async updateExpiredSession(sessionId: ObjectId, deviceInfoObject: deviceInfoObject, expires: string) 
    {
        await ACTIVE_DEVICE.updateOne({_id: sessionId}, {
                                                            $set: {
                                                                ip: deviceInfoObject.ip,
                                                                title: deviceInfoObject.title,
                                                                lastActiveDate: new Date().toISOString(),
                                                                expiresTime: expires
                                                            }
                                                        });
    }

    public async killAllSessions(ssesionId: ObjectId, userObject: userBDType) 
    {
        await ACTIVE_DEVICE.deleteMany({
                                            $and: [
                                                {_id: {$ne: ssesionId}},
                                                {userId: userObject._id}
                                            ]
                                        })
    }

    public async killOneSessionLogout(sessionId: ObjectId) 
    {
        await ACTIVE_DEVICE.deleteOne({_id: sessionId})
    }

    public async killOneSession(sessionId: ObjectId, userObject: userBDType):
        Promise<number> 
    {
        const findActiveSession: null | activeDeviceBDType = await ACTIVE_DEVICE.findOne({_id: sessionId})

        if (!findActiveSession) {
            return ERRORS_CODE.NOT_FOUND_404
        }

        if (findActiveSession._id.toString() === userObject._id.toString()) {
            return ERRORS_CODE.NOT_YOUR_OWN_403
        }

        await ACTIVE_DEVICE.deleteOne({_id: sessionId})

        return ERRORS_CODE.NO_CONTENT_204;
    }

}

export default new GuardService();