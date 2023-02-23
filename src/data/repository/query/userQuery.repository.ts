import { notStringQueryReqPagSearchAuth } from "../../../models/request.models"
import { resultUserObjectType, userAllMaps, userBDType } from "../../../models/user.models"
import { UserModel } from "../../entity/user.entity"

function sortObject(sortDir: string) {
    return (sortDir === 'desc') ? -1 : 1
}

function skippedObject(pageNum: number, pageSize: number) {
    return (pageNum - 1) * pageSize
}

class UserQueryRepository {

    public async getAllUsers(queryAll: notStringQueryReqPagSearchAuth):
        Promise<resultUserObjectType>
    {
        const usersAll: userBDType [] = await UserModel
        .find({
            $or: [
                {"infUser.login": new RegExp(queryAll.searchLoginTerm, 'gi')},
                {"infUser.email": new RegExp(queryAll.searchEmailTerm, 'gi')}
            ]
        })
        .skip(skippedObject(queryAll.pageNumber, queryAll.pageSize))
        .limit(queryAll.pageSize)
        .sort(({[queryAll.sortBy]: sortObject(queryAll.sortDirection)}))

        const allMapsUsers: userAllMaps [] = usersAll.map((fieldUser: userBDType) => {
            return {
                id: fieldUser._id,
                login: fieldUser.infUser.login,
                email: fieldUser.infUser.email,
                createdAt: fieldUser.infUser.createdAt
            }
        })

        const allCount: number = await UserModel
        .countDocuments({
            $or: [
                {"infUser.login": new RegExp(queryAll.searchLoginTerm, 'gi')},
                {"infUser.email": new RegExp(queryAll.searchEmailTerm, 'gi')}
            ]
        })

        const pagesCount: number = Math.ceil(allCount / queryAll.pageSize)

        return {
            pagesCount: pagesCount,
            page: queryAll.pageNumber,
            pageSize: queryAll.pageSize,
            totalCount: allCount,
            items: allMapsUsers
        }
    }
}

export const userQueryRepository = new UserQueryRepository()