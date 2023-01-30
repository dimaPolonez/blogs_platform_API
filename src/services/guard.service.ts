import {ObjectId} from "mongodb";
import {ACTIVE_DEVICE} from "../data/db.data";
import {deviceInfoObject} from "../models/activeDevice.models";
import e from "express";


class guardService {

    async addNewDevice(userId: ObjectId, deviceInfo: deviceInfoObject, expiresTime: number):
        Promise<number>
        {
            const dateNow: string = new Date().toString();

            let deviceId: number = await ACTIVE_DEVICE.countDocuments({userId: userId});

            await ACTIVE_DEVICE.insertOne({
                _id: new ObjectId(),
                userId: userId,
                ip: deviceInfo.ip,
                title: deviceInfo.title,
                lastActiveDate: dateNow,
                expiresTime: expiresTime,
                deviceId: deviceId++
            })
            return deviceId
    }

}

export default new guardService();