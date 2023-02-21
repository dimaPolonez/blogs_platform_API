import { userReqType } from "../../models/user.models"


class UserRepository {

    public async findOneByIdReturnDoc(userID: string) {

    }

    public async findOneById(userID: string) {

    }

    public async createUser(hushPass: string, userDTO:userReqType, authParams: authParams){

    }

    public async updateUser(){

    }

    public async deleteUser(){

    }

    public async deleteAllUser(){

    }

    public async save(model: any) {
        return await model.save()
    }
    
}

export default new UserRepository()