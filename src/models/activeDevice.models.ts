import { ObjectId } from "mongodb";


export type activeDeviceBDType = {
    _id: ObjectId,
    idUser: ObjectId,
    ip: string,
    title: string,
    lastActiveDate: string,
    deviceId: string
}