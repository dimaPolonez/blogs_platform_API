import { userBDType, userObjectResult, userReqType } from "../../models/user.models";
import {authParams} from "../../models/auth.models";
import { UserModel } from "../entity/user.entity";
import { ObjectId } from "mongodb";


class UserRepository {

    public async findOneByIdReturnDoc(userID: string) {

        const objectUserID: ObjectId = new ObjectId(userID)

        const findUserSmart = await UserModel.findOne( { _id: objectUserID } )

        return findUserSmart
    }

    public async findOneById(userID: string):
    Promise<null | userObjectResult>
    {
        const objectUserID: ObjectId = new ObjectId(userID)

        const findUserSmart: null | userBDType = await UserModel.findOne( { _id: objectUserID } )

        if (!findUserSmart) {
            return null
        }

        return {
            id: findUserSmart._id,
            login: findUserSmart.infUser.login,
            email: findUserSmart.infUser.email,
            createdAt: findUserSmart.infUser.createdAt
        }
    }

    public async findOneByLogin(userLogin: string):
    Promise<null | userObjectResult>
    {
        const findUserSmart: null | userBDType = await UserModel.findOne( { 'infUser.login': userLogin } )

        if (!findUserSmart) {
            return null
        }

        return {
            id: findUserSmart._id,
            login: findUserSmart.infUser.login,
            email: findUserSmart.infUser.email,
            createdAt: findUserSmart.infUser.createdAt
        }
    }

    public async findOneByLoginOrEmail(userLoginOrEmail: string):
    Promise<null | userBDType>
    {
        const findUserSmart: null | userBDType = await UserModel.findOne( {
            $or: [
                {"infUser.login": userLoginOrEmail},
                {"infUser.email": userLoginOrEmail}
            ]
        } )

        if (!findUserSmart) {
            return null
        }

        return findUserSmart
    }

    public async findOneByCode(codeActivated: string):
    Promise<null | userBDType>
    {
        const findUserSmart: null | userBDType = await UserModel.findOne( { 'activeUser.codeActivated': codeActivated } )

        if (!findUserSmart) {
            return null
        }

        return findUserSmart
    }

    public async findOneByEmail(email: string):
    Promise<null | userObjectResult>
    {
        const findUserSmart: null | userBDType = await UserModel.findOne( { 'infUser.email': email } )

        if (!findUserSmart) {
            return null
        }

        return {
            id: findUserSmart._id,
            login: findUserSmart.infUser.login,
            email: findUserSmart.infUser.email,
            createdAt: findUserSmart.infUser.createdAt
        }
    }

    public async findOneByEmailAll(email: string):
    Promise<null | userBDType>
    {
        const findUserSmart: null | userBDType = await UserModel.findOne( { 'infUser.email': email } )

        if (!findUserSmart) {
            return null
        }

        return findUserSmart
    }

    public async createUser(hushPass: string, userDTO:userReqType, authParams: authParams):
        Promise<userObjectResult>
    {
        const newUserSmart = await UserModel.createUser(hushPass, userDTO, authParams)

        return {
            id: newUserSmart._id,
            login: newUserSmart.infUser.login,
            email: newUserSmart.infUser.email,
            createdAt: newUserSmart.infUser.createdAt
        }
    }

    public async updateUser(userID: string, authParams: authParams){
        await UserModel.updateUser(userID, authParams)
    }

    public async updatePasswordUser(userID: string, authParams: authParams, newHashPass: string){
        await UserModel.updatePasswordUser(userID, authParams, newHashPass)
    }

    public async deleteUser(userID: string):
        Promise<boolean>
    {
        const findUser: null | userObjectResult = await this.findOneById(userID)
        
        if (!findUser) {
            return false
        }

        await UserModel.deleteOne( { _id: findUser.id } )
        
        return true
    }

    public async deleteAllUser(){
        await UserModel.deleteMany({})
    }

    public async save(model: any) {
        return await model.save()
    }
    
}

export default new UserRepository()