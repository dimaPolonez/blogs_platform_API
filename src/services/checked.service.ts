import {userBDType, userObjectResult} from "../models/user.models";
import {isAfter} from "date-fns";
import {userRepository} from "../data/repository/user.repository";

class CheckedService {

    public async loginUniq(value: string):
        Promise<boolean> {
        const findUser: null | userObjectResult = await userRepository.findOneByLogin(value)

        if (findUser) {
            return false
        }

        return true
    }

    public async emailUniq(value: string):
        Promise<boolean> {
        const findUser: null | userObjectResult = await userRepository.findOneByEmail(value)

        if (findUser) {
            return false
        }

        return true
    }

    public async activateCodeValid(value: string):
        Promise<boolean> {
        const findUser: null | userBDType = await userRepository.findOneByCode(value)

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
        Promise<boolean> {
        const findUser: null | userBDType = await userRepository.findOneByEmailAll(value)

        if (!findUser) {
            throw new Error('Email is not registration')
        }

        if (findUser.activeUser.codeActivated === 'Activated') {
            throw new Error('Account activated')
        }

        return true
    }

}

export const checkedService = new CheckedService()