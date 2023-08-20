import {ObjectId} from "mongodb";
import {ActiveDeviceBDType, ReturnActiveDeviceType} from "../../../core/models";
import {ACTIVE_DEVICE} from "../../../core/db.data";


class SessionsQueryRepository {

    async getAllSessions(
        userId: ObjectId
    ):Promise<ReturnActiveDeviceType[]>{

        const allActiveDevice: ActiveDeviceBDType [] = await ACTIVE_DEVICE.find({userId: userId}).toArray()

        return allActiveDevice.map((fieldDevice: ActiveDeviceBDType) => {
            return {
                deviceId: fieldDevice._id,
                ip: fieldDevice.ip,
                lastActiveDate: fieldDevice.lastActiveDate,
                title: fieldDevice.title
            }
        })
    }

}

export default new SessionsQueryRepository()