import nodemailer, { Transporter } from 'nodemailer';

class MailService {
    transporter: Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            // @ts-ignore
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        });
    }

    async sendActivateMail(to: string, link: string) {
        const activateLink = `${process.env.URL}:3000/api/v1/auth/activate/${link}`;

        await this.transporter.sendMail({
            to: to,
            from: "gurb8809@yandex.ru",
            subject: "account activate",
            text: "",
            html: `
                <h3>Активация аккаунта</h3>
                <a href=${activateLink}>Активировать</a>
            `
        })
    }

    async check() {
        this.transporter.verify(function (error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log("Server is ready to take our messages");
            }
        });
    }
}

export const mailService = new MailService();
