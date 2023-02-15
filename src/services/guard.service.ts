import {isAfter} from "date-fns";
import {ObjectId} from "mongodb";
import {ACTIVE_DEVICE, ERRORS_CODE} from "../data/db.data";
import {activeDeviceBDType, deviceInfoObject, returnActiveDevice} from "../models/activeDevice.models";
import {userBDType} from "../models/user.models";


class GuardService {

    public async addNewDevice(userId: ObjectId, deviceInfo: deviceInfoObject, expiresTime: string):
        Promise<ObjectId>
    {
        const newGenerateId: ObjectId = new ObjectId()

        const nowDate: string = new Date().toISOString()

        await ACTIVE_DEVICE.insertOne({
                                        _id: newGenerateId,
                                        userId: userId,
                                        ip: deviceInfo.ip,
                                        title: deviceInfo.title,
                                        lastActiveDate: nowDate,
                                        expiresTime: expiresTime
                                    })

        return newGenerateId
    }

    public async allActiveSessions(userID: ObjectId):
        Promise<null | returnActiveDevice> 
    {
        const allActiveDevice: null | activeDeviceBDType = await ACTIVE_DEVICE.findOne({userId: userID})

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
        const findID: ObjectId = new ObjectId (sessionId)

        const findActiveSession: null | activeDeviceBDType = await ACTIVE_DEVICE.findOne({_id: findID})

        if (!findActiveSession) {
            return false
        }

        const date = Date.parse(findActiveSession.expiresTime)

        if (isAfter(date, new Date())){
            return true
        } else {
            return false
        }
    }

    public async updateExpiredSession(sessionId: ObjectId, deviceInfoObject: deviceInfoObject, expires: string) 
    {
        const nowDate: string = new Date().toISOString()

        await ACTIVE_DEVICE.updateOne({_id: sessionId}, {
                                                            $set: {
                                                                ip: deviceInfoObject.ip,
                                                                title: deviceInfoObject.title,
                                                                lastActiveDate: nowDate,
                                                                expiresTime: expires
                                                            }
                                                        });
    }

    public async killAllSessions(sessionId: ObjectId, userObject: userBDType) 
    {
        await ACTIVE_DEVICE.deleteMany({
                                            $and: [
                                                {_id: {$ne: sessionId}},
                                                {userId: userObject._id}
                                            ]
                                        })
    }

    public async killOneSessionLogout(sessionId: ObjectId) 
    {
        await ACTIVE_DEVICE.deleteOne({_id: sessionId})
    }

    public async killOneSession(sessionURIId: string, userObject: userBDType):
        Promise<number> 
    {
        const sessionId: ObjectId = new ObjectId(sessionURIId)

        const findActiveSession: null | activeDeviceBDType = await ACTIVE_DEVICE.findOne({_id: sessionId})

        if (!findActiveSession) {
            return ERRORS_CODE.NOT_FOUND_404
        }

        if (findActiveSession._id.toString() === userObject._id.toString()) {
            return ERRORS_CODE.NOT_YOUR_OWN_403
        }

        await ACTIVE_DEVICE.deleteOne({_id: sessionId})

        return ERRORS_CODE.NO_CONTENT_204
    }

}

export default new GuardService()