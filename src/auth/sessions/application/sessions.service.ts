import {isAfter} from "date-fns";
import {ObjectId} from "mongodb";
import {ACTIVE_DEVICE, ERRORS_CODE} from "../../../core/db.data";
import {ActiveDeviceBDType, DeviceInfoObjectType, ReturnActiveDeviceType, UserBDType} from "../../../core/models";


class SessionsService {

    public async addNewDevice(
        userId: ObjectId,
        deviceInfo: DeviceInfoObjectType,
        expiresTime: string
    ):Promise<ObjectId>{
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

    public async allActiveSessions(
        userID: ObjectId
    ):Promise<ReturnActiveDeviceType[]>{
        const allActiveDevice: ActiveDeviceBDType [] = await ACTIVE_DEVICE.find({userId: userID}).toArray()

        const returnObject: ReturnActiveDeviceType [] = allActiveDevice.map((fieldDevice: ActiveDeviceBDType) => {
            return {
                deviceId: fieldDevice._id,
                ip: fieldDevice.ip,
                lastActiveDate: fieldDevice.lastActiveDate,
                title: fieldDevice.title
            }
        })

        return returnObject
    }

    async checkedActiveSession(
        reqID: ObjectId
    ):Promise<boolean>{
        const sessionId: ObjectId = new ObjectId(reqID)

        const findActiveSession: null | ActiveDeviceBDType = await ACTIVE_DEVICE.findOne({_id: sessionId})

        if (!findActiveSession) {
            return false
        }

        const date = Date.parse(findActiveSession.expiresTime)

        if (!(isAfter(date, new Date()))){
            return false
        }

        return true
    }

    public async updateExpiredSession(
        reqID: ObjectId,
        deviceInfoObject: DeviceInfoObjectType,
        expires: string
    ){
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

    public async killAllSessions(
        reqID: ObjectId,
        userObject: UserBDType
    ){
        const sessionId: ObjectId = new ObjectId(reqID)

        await ACTIVE_DEVICE.deleteMany({
                                            $and: [
                                                {_id: {$ne: sessionId}},
                                                {userId: userObject._id}
                                            ]
                                        })
    }

    public async killOneSessionLogout(
        reqID: ObjectId
    ){
        const sessionId: ObjectId = new ObjectId(reqID)

        await ACTIVE_DEVICE.deleteOne({_id: sessionId})
    }

    public async killOneSession(
        sessionURIId: string,
        userObject: UserBDType
    ):Promise<number>{
        const sessionId: ObjectId = new ObjectId(sessionURIId)

        const findActiveSession: null | ActiveDeviceBDType = await ACTIVE_DEVICE.findOne({_id: sessionId})

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

export default new SessionsService()