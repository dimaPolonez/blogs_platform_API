import nodemailer from "nodemailer";
import { settings } from "../data/db.data";

class mailerApp {

    private async options(objectMail: object){

        const transporter = nodemailer.createTransport({
            host: "smtp.yandex.ru",
            auth: settings.MAIL_URL
          });

        transporter.sendMail(objectMail);
        
    } 

    public async sendMailCode(email: string)
    {
          this.options({
            from: 'Blogs_platform_API <testPolonez@yandex.ru>',
            to: email,
            subject: `<h1>You have successfully registered on our service!</h1>
             <p>To activate your account, follow the link:
             <a href="URL"></p>`,
            text: 'You have successfully registered'
        })

    }

    public async sendMailRepeat(email: string)
    {
          this.options({
            from: 'Blogs_platform_API <testPolonez@yandex.ru>',
            to: email,
            subject: `<h1>We resent you an email with a link to activate your user</h1>
             <p>To activate your account, follow the link:
             <a href="URL"></p>`,
            text: 'We resent you an email'
        })

    }

    public async sendMailActivate(email: string)
    {
        this.options({
            from: 'Blogs_platform_API <testPolonez@yandex.ru>',
            to: email,
            subject: `<h1>Congratulations!</h1>
             <p> You have activated your account!</p>`,
            text: 'Congratulations!'
        })
    }
}

export default new mailerApp();