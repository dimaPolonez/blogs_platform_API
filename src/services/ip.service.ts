import {ObjectID} from "bson";
import {differenceInSeconds} from "date-fns";
import {OBJECT_IP} from "../data/db.data";
import {objectIpBDType} from "../models/session.models";


class IpService {

    public async findIP(ip: string):
        Promise<boolean> 
    {
        const findIp: null | objectIpBDType = await OBJECT_IP.findOne({ip: ip})

        if (!findIp) {
            return await this.createIP(ip)
        }

        return await this.checkIP(findIp)
    }

    private async createIP(ip: string):
        Promise<boolean> 
    {
       /* await OBJECT_IP.insertOne({
            _id: new ObjectID(),
            ip: ip,
            lastDate: new Date(),
            tokens: 4
        })*/

        return true
    }

    private async checkIP(objectIP: objectIpBDType):
        Promise<boolean> 
    {
        const newDateCreated: Date = new Date()

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

export default new IpService()