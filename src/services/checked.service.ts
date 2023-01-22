import {userBDType} from "../models/user.models";
import {USERS} from "../data/db.data";
import {isAfter} from "date-fns";

class checkedService {

    public async loginUniq(value: string) {

        const findUser: userBDType [] = await USERS.find({ "infUser.login": value}).toArray();

        if (findUser.length !== 0) {
            throw new Error('This login already exists in the system')
        } else {
            return true
        }
    }

    public async emailUniq(value: string) {

        const findUser: userBDType [] = await USERS.find({ "infUser.email": value}).toArray();

        if (findUser.length !== 0) {
            throw new Error('This email already exists in the system')
        } else {
            return true
        }
    }

    public async activateCodeValid(value: string) {

        const findUser: userBDType [] = await USERS.find({"activeUser.codeActivated": value}).toArray();

        if (findUser.length === 0) {
            throw new Error('Code is not valid')
        }

        const result: boolean [] = findUser.map((f: userBDType) => {
            const nowDate = new Date();

            const date = Date.parse(f.activeUser.lifeTimeCode)

            return isAfter(date, nowDate)
        });

        if (!result[0]) {
            throw new Error('Code is not valid')
        } else {
            return true
        }
    }

    public async emailToBase(value: string) {

        const findUser: userBDType [] = await USERS.find({"infUser.email": value}).toArray();

        if (findUser.length === 0) {
            throw new Error('Email is not registration')
        }

        const result: string [] = findUser.map((f: userBDType) => f.activeUser.codeActivated);

        if (result[0] === 'Activated') {
            throw new Error('Account activated')
        }

        return true
    }

}

export default new checkedService();