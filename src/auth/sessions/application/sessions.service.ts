import {isAfter} from "date-fns";
import {ObjectId} from "mongodb";
import {ACTIVE_DEVICE, ERRORS_CODE} from "../../../core/db.data";
import {ActiveDeviceBDType, DeviceInfoObjectType} from "../../../core/models";
import SessionsRepository from "../repository/sessions.repository";


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

    async checkedActiveSession(
        reqID: ObjectId
    ):Promise<boolean>{
        const sessionId: ObjectId = new ObjectId(reqID)

        const findActiveSession: null | ActiveDeviceBDType = await
            ACTIVE_DEVICE.findOne({_id: sessionId})

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
        sessionId: ObjectId,
        userId: ObjectId
    ){
        await SessionsRepository.deleteAllSessions(sessionId, userId)
    }

    public async killOneSessionLogout(
        reqID: ObjectId
    ){
        const sessionId: ObjectId = new ObjectId(reqID)

        await ACTIVE_DEVICE.deleteOne({_id: sessionId})
    }

    public async killOneSession(
        sessionId: string,
        userId: ObjectId
    ):Promise<number>{

        const findActiveSession: ActiveDeviceBDType | null = await
            SessionsRepository.findOne(new ObjectId(sessionId))

        if (!findActiveSession) {
            return ERRORS_CODE.NOT_FOUND_404
        }

        if (findActiveSession.userId.toString() !== userId.toString()) {
            return ERRORS_CODE.NOT_YOUR_OWN_403
        }

        await SessionsRepository.deleteOne(new ObjectId(sessionId))

        return ERRORS_CODE.NO_CONTENT_204
    }
}
export default new SessionsService()