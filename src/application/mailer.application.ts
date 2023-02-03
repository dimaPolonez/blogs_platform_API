import nodemailer from "nodemailer";
import {settings} from "../data/db.data";

class mailerApp {

    private async options(objectMail: object) {

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: settings.MAIL_URL_USER,
                pass: settings.MAIL_URL_PASS
            }
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

    public async sendMailActivate(email: string) {
        await this.options({
            from: 'Blogs_platform_API <testPolonez@yandex.ru>',
            to: email,
            subject: 'Congratulations!',
            html: `<h2>Congratulations!</h2>
            <p> You have activated your account!</p>`
        })
    }

    public async sendMailPass(email: string, codeActive: string) {
        await this.options({
            from: 'Blogs_platform_API <testPolonez@yandex.ru>',
            to: email,
            subject: 'Password recovery',
            html: `<h2>Password recovery</h2><p>To finish password recovery please follow the link below: 
    <a href="https://blogs-platform-api.vercel.app/password-recovery?recoveryCode=${codeActive}">
    recovery password</a></p>`
        })
    }

    public async sendPassActivate(email: string) {
        await this.options({
            from: 'Blogs_platform_API <testPolonez@yandex.ru>',
            to: email,
            subject: 'Congratulations!',
            html: `<h2>Congratulations!</h2>
            <p> You have created new password!</p>`
        })
    }
}

export default new mailerApp();