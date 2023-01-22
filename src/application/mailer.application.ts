import nodemailer from "nodemailer";
import {settings} from "../data/db.data";

class mailerApp {

    private async options(objectMail: object) {

        const transporter = nodemailer.createTransport({
            host: "smtp.yandex.ru",
            port: 465,
            secure: true,
            auth: settings.MAIL_URL
        });

        transporter.sendMail(objectMail);

    }

    public async sendMailCode(email: string, codeActive: string) {
        this.options({
            from: 'Blogs_platform_API <testPolonez@yandex.ru>',
            to: email,
            subject: 'You have successfully registered',
            html: `<h2>You have successfully registered on our service!</h2><p>To activate your account, follow the link: <a href="https://blogs-platform-api.vercel.app/confirm-registration?code=${codeActive}">https://blogs-platform-api.vercel.app/confirm-registration?code=${codeActive}</a></p>`
        })

    }

    public async sendMailRepeat(email: string, codeActive: string) {
        this.options({
            from: 'Blogs_platform_API <testPolonez@yandex.ru>',
            to: email,
            subject: 'We resent you an email',
            html: `<h2>We resent you an email with a link to activate your user</h2>
            <p>To activate your account, follow the link:
            <a href="https://blogs-platform-api.vercel.app/confirm-registration?code=${codeActive}">https://blogs-platform-api.vercel.app/confirm-registration?code=${codeActive}</a></p>`
        })
    }

    public async sendMailActivate(email: string) {
        this.options({
            from: 'Blogs_platform_API <testPolonez@yandex.ru>',
            to: email,
            subject: 'Congratulations!',
            html: `<h2>Congratulations!</h2>
            <p> You have activated your account!</p>`
        })
    }
}

export default new mailerApp();