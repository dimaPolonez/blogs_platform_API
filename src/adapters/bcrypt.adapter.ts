import bcrypt from "bcrypt";

class BcryptApp {

    public async saltGenerate(password: string): 
        Promise<string> 
    {
        const salt: string = await bcrypt.genSalt(10)

        return await this.hushGenerate(password, salt)
    }

    private async hushGenerate(password: string, salt: string): 
        Promise<string> 
    {
        return await bcrypt.hash(password, salt)
    }

    public async hushCompare(password: string, hush: string): 
        Promise<boolean> 
    {
        return await bcrypt.compare(password, hush)
    }

}

export default new BcryptApp()