import { ObjectId } from "mongodb";


export type activeDeviceBDType = {
    _id: ObjectId,
    userId: ObjectId,
    ip: string,
    title: string,
    lastActiveDate: string,
    expiresTime: number,
    deviceId: number
}

export type deviceInfoObject = {
    ip: string,
    title: string
}