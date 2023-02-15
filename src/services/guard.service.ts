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
        Promise<returnActiveDevice[]> 
    {
        const allActiveDevice: activeDeviceBDType [] = await ACTIVE_DEVICE.find({userId: userID}).toArray()

        const returnObject: returnActiveDevice [] = allActiveDevice.map((fieldDevice: activeDeviceBDType) => {
            return {
                deviceId: fieldDevice._id,
                ip: fieldDevice.ip,
                lastActiveDate: fieldDevice.lastActiveDate,
                title: fieldDevice.title
            }
        })

        return returnObject
    }

    async checkedActiveSession(reqID: ObjectId):
        Promise<boolean> 
    {
        const sessionId: ObjectId = new ObjectId(reqID)

        const findActiveSession: null | activeDeviceBDType = await ACTIVE_DEVICE.findOne({_id: sessionId})

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

    public async updateExpiredSession(reqID: ObjectId, deviceInfoObject: deviceInfoObject, expires: string) 
    {
        const sessionId: ObjectId = new ObjectId(reqID)
        
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

    public async killAllSessions(reqID: ObjectId, userObject: userBDType) 
    {
        const sessionId: ObjectId = new ObjectId(reqID)

        await ACTIVE_DEVICE.deleteMany({
                                            $and: [
                                                {_id: {$ne: sessionId}},
                                                {userId: userObject._id}
                                            ]
                                        })
    }

    public async killOneSessionLogout(reqID: ObjectId) 
    {
        const sessionId: ObjectId = new ObjectId(reqID)

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

        if (!(findActiveSession.userId.toString() === userObject._id.toString())) {
            return ERRORS_CODE.NOT_YOUR_OWN_403            
        }

        await ACTIVE_DEVICE.deleteOne({_id: sessionId})

        return ERRORS_CODE.NO_CONTENT_204
            
    }

}

export default new GuardService()