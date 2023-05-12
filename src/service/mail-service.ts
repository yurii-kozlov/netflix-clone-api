import nodemailer, {Transporter, TransportOptions} from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

class MailService {
  transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    } as TransportOptions)
  }

  async sendActivationMail(to: string, activationLink: string) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: `Account activation one the website ${process.env.API_URL}`,
      text: '',
      html: 
        `
          <div>
            <h1>Follow the link below to activate your account</h1>
            <a href="${activationLink}">${activationLink}</a>
          </div>
        `
    })
  }
}

export default new MailService();
