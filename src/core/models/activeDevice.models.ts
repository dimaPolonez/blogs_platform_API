import {ObjectId} from "mongodb";


export type ActiveDeviceBDType = {
    _id: ObjectId,
    userId: ObjectId,
    ip: string,
    title: string,
    lastActiveDate: string,
    expiresTime: string
}

export type DeviceInfoObjectType = {
    ip: string,
    title: string
}

export type ReturnActiveDeviceType = {
    ip: string,
    title: string,
    lastActiveDate: string,
    deviceId: ObjectId
}

export type ReturnRefreshObjectType = {
    userId: ObjectId,
    sessionId: ObjectId
}

export type ObjectIPType = {
    _id: ObjectId,
    ip: string,
    tokens: number,
    lastDate: Date
}