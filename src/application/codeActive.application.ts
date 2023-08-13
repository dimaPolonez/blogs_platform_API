import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";
import {authParams} from "../models/userAuth.models";


class ActiveCodeApp {

    public async createCode():
        Promise<authParams> {
        const authParams: authParams = {
            confirm: false,
            codeActivated: uuidv4(),
            lifeTimeCode: await this.createTime()
        }

        return authParams
    }

    private async createTime():
        Promise<string> {
        const lifetime: string = add(new Date(), {
            hours: 1,
            minutes: 10
        }).toString()

        return lifetime
    }
}

export const activateCodeApp = new ActiveCodeApp()