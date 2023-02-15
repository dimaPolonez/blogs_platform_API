import {userBDType} from "../models/user.models";
import {USERS} from "../data/db.data";
import {isAfter} from "date-fns";
import AuthService from "./auth.service";

class CheckedService {

    public async loginUniq(value: string):
        Promise<boolean>
    {
        const findUser: null | userBDType = await USERS.findOne({"infUser.login": value})

        if (findUser) {
            return false
        }

        return true
    }

    public async emailUniq(value: string):
        Promise<boolean>
    {
        const findUser: null | userBDType = await USERS.findOne({"infUser.email": value})

        if (findUser) {
            return false
        }

        return true
    }

    public async activateCodeValid(value: string):
        Promise<boolean>
    {
        const findUser: null | userBDType = await USERS.findOne({"activeUser.codeActivated": value})

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

    public async emailToBase(value: string):
        Promise<boolean>
    {
        const findUser: null | userBDType = await AuthService.findOneUserToEmail(value)

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