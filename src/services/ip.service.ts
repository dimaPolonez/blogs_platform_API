import { ObjectID } from "bson";
import { differenceInSeconds } from "date-fns";
import { OBJECT_IP } from "../data/db.data";
import {objectIP} from "../models/activeDevice.models";


class ipService {

    async find(ip: string):
    Promise<boolean>
    {

       const find: objectIP [] = await OBJECT_IP.find({ip: ip}).toArray(); 

       if (find.length === 0) {
        return this.create(ip)
       }

       return this.check(find[0])

    }

    async create(ip: string):
    Promise<true> 
    {

        const newDateCreated: Date = new Date()

        await OBJECT_IP.insertOne({
            _id: new ObjectID(),
            ip: ip,
            lastDate: newDateCreated,
            tokens: 4
        })

        return true 

    }

    async check(objectIP: objectIP):
    Promise<boolean> 
    {

        const newDateCreated: Date = new Date()
        
        let seconds: number = differenceInSeconds(newDateCreated, objectIP.lastDate)

        if (seconds <= 10) {

            if (objectIP.tokens > 0) {

                let newToken: number = objectIP.tokens - 1;

                await OBJECT_IP.updateOne({ip: objectIP.ip}, {
                    $set: {
                            tokens: newToken
                    }
                })
            } else {
                return false
            }
        } else {
            await OBJECT_IP.updateOne({_id: objectIP._id}, {
                $set: {
                        lastDate: newDateCreated,
                        tokens: 4
                }
            })

            return true
        }

        return true
    }
}

export default new ipService();