import nodemailer from "nodemailer";
import {settings} from "../data/db.data";

class mailerApp {

    private async options(objectMail: object) {

        const transporter = nodemailer.createTransport({
            host: "smtp.yandex.ru",
            port: 465,
            secure: true,
            auth: {user: 'testPolonez@yandex.ru', pass: 'testPolonez2023'}
        });

        try {
            await transporter.sendMail(objectMail);
        } catch (e) {
            console.log(e)
        }


    }

    public async sendMailCode(email: string, codeActive: string) {
        await this.options({
            from: 'Blogs_platform_API <testPolonez@yandex.ru>',
            to: email,
            subject: 'You have successfully registered',
            html: `<h2>You have successfully registered on our service!</h2><p>To activate your account, follow the link: 
    <a href="https://blogs-platform-api.vercel.app/confirm-email?code=${codeActive}">
    complete registration</a></p>`
        })
    }

    public async sendMailRepeat(email: string, codeActive: string) {
        await this.options({
            from: 'Blogs_platform_API <testPolonez@yandex.ru>',
            to: email,
            subject: 'We resent you an email',
            html: `<h2>You have successfully registered on our service!</h2><p>To activate your account, follow the link: 
    <a href="https://blogs-platform-api.vercel.app/confirm-email?code=${codeActive}">
    complete registration</a></p>`
        })
    }

    public async sendMailActivate(email: string) {
        await this.options({
            from: 'Blogs_platform_API <testPolonez@yandex.ru>',
            to: email,
            subject: 'Congratulations!',
            html: `<h2>Congratulations!</h2>
            <p> You have activated your account!</p>`
        })
    }
}

export default new mailerApp();