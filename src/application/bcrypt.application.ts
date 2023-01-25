import bcrypt from "bcrypt";

class bcryptApp {

    public async saltGenerate(password: string): Promise<string> {

        const salt: string = await bcrypt.genSalt(10);
        const hush: string = await this.hushGenerate(password, salt);

        return hush
    }

    private async hushGenerate(password: string, salt: string): Promise<string> {

        const hush: string = await bcrypt.hash(password, salt);

        return hush
    }

    public async hushCompare(password: string, hush: string): Promise<boolean> {

        const result: boolean = await bcrypt.compare(password, hush);

        return result
    }
}

export default new bcryptApp();