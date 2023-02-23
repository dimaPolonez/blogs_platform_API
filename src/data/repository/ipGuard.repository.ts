import { objectIpBDType } from "../../models/session.models"
import { IpGuardModel } from "../entity/ipGuard.entity"


class IpGuardRepository {

    public async findOneByIdReturnDoc(ip: string){
        const findIpSmart = await IpGuardModel.findOne({ip: ip})

        if (!findIpSmart) {
            return null
        }

        return findIpSmart
    }

    public async findOne(ip: string): Promise<null | objectIpBDType>{
        
        const findIpSmart: null | objectIpBDType = await IpGuardModel.findOne({ip: ip})

        if (!findIpSmart) {
            return null
        }

        return findIpSmart
    }

    public async deleteAllUser(){
        await IpGuardModel.deleteMany({})
    }

    public async save(model: any) {
        return await model.save()
    }
    
}

export const ipGuardRepository = new IpGuardRepository()