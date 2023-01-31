import { ObjectId } from "mongodb";


export type activeDeviceBDType = {
    _id: ObjectId,
    userId: ObjectId,
    ip: string,
    title: string,
    lastActiveDate: string,
    expiresTime: string,
    deviceId: string
}

export type deviceInfoObject = {
    ip: string,
    title: string
}

export type returnActiveDevice = {
    ip: string,
    title: string,
    lastActiveDate: string,
    deviceId: string
}