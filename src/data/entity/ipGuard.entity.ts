import { ObjectId } from "mongodb";
import mongoose, { HydratedDocument, Model, Schema } from "mongoose";
import { ipGuardRepository } from "../repository/ipGuard.repository";

export type ipGuardBDType = {
    _id: ObjectId,
    ip: string,
    tokens: number,
    lastDate: Date
}

type ipGuardMethodsType = {
    updateToken(ip: string, newToken: number): HydratedDocument<ipGuardBDType, ipGuardStaticType>,
    updateTokenAndDate(ip: string, newToken: number): HydratedDocument<ipGuardBDType, ipGuardStaticType>
}

type ipGuardStaticType = Model<ipGuardBDType, {}, ipGuardMethodsType> & {
    createIp(ip: string): HydratedDocument<ipGuardBDType, ipGuardStaticType>
}

export const ipGuardBDSchema = new Schema<ipGuardBDType, ipGuardStaticType, ipGuardMethodsType>({
    ip: String,
    tokens: Number,
    lastDate: Date
})

ipGuardBDSchema.static({
    async createIp(ip: string){

        const newIpSmart = new IpGuardModel({
            ip: ip,
            lastDate: new Date(),
            tokens: 4
        })

        return newIpSmart
    }
})

ipGuardBDSchema.method({
    async updateToken(ip: string, newToken: number) {

        const findUserDocument = await ipGuardRepository.findOneByIdReturnDoc(ip)

        if (!findUserDocument) {
            return false
        }

        findUserDocument.tokens = newToken

        return findUserDocument
    }
})

ipGuardBDSchema.method({
    async updateTokenAndDate(ip: string, newToken: number){

        const findUserDocument = await ipGuardRepository.findOneByIdReturnDoc(ip)

        if (!findUserDocument) {
            return false
        }

        findUserDocument.tokens = newToken
        findUserDocument.lastDate = new Date()

        return findUserDocument
    }
})

export const IpGuardModel = mongoose.model<ipGuardBDType, ipGuardStaticType>('stackIP', ipGuardBDSchema)