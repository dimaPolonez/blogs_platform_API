import bcrypt from "bcrypt";

class bcryptApp {

    async saltGenerate(password: string) {

        const salt = await bcrypt.genSalt(10);
        const hush = await this.hushGenerate(password, salt);

        return hush
    }

    async hushGenerate(password: string, salt: string) {

        const hush = await bcrypt.hash(password, salt);

        return hush
    }

    async hushCompare(password: string, hush: string) {

        const result = await bcrypt.compare(password, hush);

        return result
    }

}

export default new bcryptApp();