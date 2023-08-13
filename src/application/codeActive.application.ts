import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";
import {authParams} from "../models";


class ActiveCodeApp {

    public async createCode():
        Promise<authParams> 
    {
        return {
            confirm: false,
            codeActivated: uuidv4(),
            lifeTimeCode: await this.createTime()
        }
    }

    private async createTime():
        Promise<string> 
    {
        return add(new Date(), {
            hours: 1,
            minutes: 10
        }).toString()
    }
}

export default new ActiveCodeApp()