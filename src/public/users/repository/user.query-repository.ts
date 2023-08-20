import {
    NotStringQueryReqPagSearchAuthType,
    ResultUserObjectType, UserAllMapsType,
    UserBDType,
    UserObjectResultType
} from "../../../core/models";
import {USERS} from "../../../core/db.data";
import {ObjectId} from "mongodb";

function sortObject(sortDir: string)
{
    return (sortDir === 'desc') ? -1 : 1
}

function skippedObject(pageNum: number, pageSize: number)
{
    return (pageNum - 1) * pageSize
}

class UserQueryRepository {
    async getOneUser(
        userId: string
    ):Promise<UserObjectResultType | null>{
        const findUser: UserBDType | null = await USERS.findOne({_id: new ObjectId(userId)})

        if (!findUser) {
            return null
        }

        return {
            id: new ObjectId(userId),
            login: findUser.infUser.login,
            email: findUser.infUser.email,
            createdAt: findUser.infUser.createdAt
        }
    }

    async getAllUsers(
        queryAll: NotStringQueryReqPagSearchAuthType
    ):Promise<ResultUserObjectType>{
        const usersAll: UserBDType [] = await USERS
            .find(
                {
                    $or: [
                        {"infUser.login": new RegExp(queryAll.searchLoginTerm, 'gi')},
                        {"infUser.email": new RegExp(queryAll.searchEmailTerm, 'gi')}
                    ]
                }
            )
            .skip(skippedObject(queryAll.pageNumber, queryAll.pageSize))
            .limit(queryAll.pageSize)
            .sort(({[queryAll.sortBy]: sortObject(queryAll.sortDirection)})).toArray()

        const allMapsUsers: UserAllMapsType[] = usersAll.map((fieldUser: UserBDType) => {
            return {
                id: fieldUser._id,
                login: fieldUser.infUser.login,
                email: fieldUser.infUser.email,
                createdAt: fieldUser.infUser.createdAt
            }
        })

        const allCount: number = await USERS.countDocuments(
            {
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
export default new UserQueryRepository()