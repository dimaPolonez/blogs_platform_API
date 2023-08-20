import {BLOGS, USERS} from "../core/db.data";
import {isAfter} from "date-fns";
import {BlogBDType, UserBDType} from "../core/models";
import {ObjectId} from "mongodb";

class CheckedService {

    public async findBlog(
        blogId: string
    ):Promise<string | null>{
        const findBlog: BlogBDType | null = await BLOGS.findOne({_id: new ObjectId(blogId)})

        if (!findBlog) {
            return null
        }

        return findBlog.name
    }

    public async loginUniq(
        value: string
    ):Promise<boolean>{
        const findUser: null | UserBDType = await USERS.findOne({"infUser.login": value})

        if (findUser) {
            return false
        }

        return true
    }

    public async emailUniq(
        value: string
    ):Promise<boolean>{
        const findUser: null | UserBDType = await USERS.findOne({"infUser.email": value})

        if (findUser) {
            return false
        }

        return true
    }

    public async activateCodeValid(
        value: string
    ):Promise<boolean>{
        const findUser: null | UserBDType = await USERS.findOne({"activeUser.codeActivated": value})

        if (!findUser) {
            throw new Error('Code is not valid')
        }

        const date = Date.parse(findUser.activeUser.lifeTimeCode)

        if (isAfter(date, new Date())) {
            return true
        } else {
            throw new Error('Code is not valid')
        }
    }

    public async emailToBase(
        value: string
    ):Promise<boolean>{
        const findUser: null | UserBDType = await USERS.findOne(
            {
                $or: [
                    {"infUser.login": value},
                    {"infUser.email": value}
                ]
            })

        if (!findUser) {
            throw new Error('Email is not registration')
        }

        if (findUser.activeUser.codeActivated === 'Activated'){
            throw new Error('Account activated')
        }
        return true
    }

}

export default new CheckedService()