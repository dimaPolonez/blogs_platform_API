import {ObjectId} from "mongodb";


export type sessionBDType = {
    _id: ObjectId,
    userId: ObjectId,
    ip: string,
    title: string,
    lastActiveDate: string,
    expiresTime: string
}

export type deviceInfoObject = {
    ip: string,
    title: string
}

export type returnActiveDevice = {
    ip: string,
    title: string,
    lastActiveDate: string,
    deviceId: ObjectId
}

export type returnRefreshObject = {
    userId: ObjectId,
    sessionId: ObjectId
}

export type objectIpBDType = {
    _id: ObjectId,
    ip: string,
    tokens: number,
    lastDate: Date
}