import {differenceInSeconds} from "date-fns";
import { ObjectId } from "mongodb";
import { Document } from "mongoose";
import { ipGuardBDType, IpGuardModel } from "../data/entity/ipGuard.entity";
import { ipGuardRepository } from "../data/repository/ipGuard.repository";
import {objectIpBDType} from "../models/session.models";


class IpGuardService {

    public async findIP(ip: string):
        Promise<boolean> 
    {
        const findIp = await ipGuardRepository.findOneByIdReturnDoc(ip)

        if (!findIp) {
            return await this.createIP(ip)
        }

        return await this.checkIP(findIp)
    }

    private async createIP(ip: string):
        Promise<boolean> 
    { 
        const ipDoc = await IpGuardModel.createIp(ip)

        ipDoc.createIp()

        await ipGuardRepository.save(ipDoc)

        return true
    }

    private async checkIP(objectIP: ):
        Promise<boolean> 
    {
        let seconds: number = differenceInSeconds(new Date(), objectIP.lastDate)

        if (seconds <= 10) {

            if (objectIP.tokens > 0){

                let newToken: number = objectIP.tokens - 1

                await OBJECT_IP.updateOne({ip: objectIP.ip}, {
                    $set: {
                        tokens: newToken
                    }
                })

                return true
            }

            return false
        }
        
        await OBJECT_IP.updateOne({_id: objectIP._id}, {
                                                            $set: {
                                                                lastDate: newDateCreated,
                                                                tokens: 4
                                                            }
                                                        })

        return true
    }
}

export const ipGuardService = new IpGuardService()