import mailer from 'nodemailer';
import configConstants from '../config/constants';
import { MailSettings } from './interfaces';
import fs from 'fs';
import Handlebars from 'handlebars';
import path from 'path';

export default class MailerService {
  createConnection() {
    return mailer.createTransport({
      host: configConstants.SMTP_HOST,
      service: configConstants.SMTP_SERVICE,
      port: configConstants.SMTP_PORT,
      secure: true,
      auth: {
        user: configConstants.SMTP_USER,
        pass: configConstants.SMTP_PASSWORD,
      },
    });
  }

  async sendEmail(verifyToken: string, recipient: string, name: string): Promise<any> {
    // eslint-disable-next-line no-useless-catch
    try {
      const transporter = this.createConnection();
      const filePath = path.join(path.resolve(__dirname), '../', 'view', 'verifyTemplate.html');
      const htmlFile = fs.readFileSync(filePath, 'utf-8');
      const template = Handlebars.compile(htmlFile);
      const redirectLink = `http://${configConstants.FE_HOST}:${configConstants.FE_PORT}/user-verification/${verifyToken}`;
      const replacement = {
        name: name,
        redirectLink,
      };
      const html = template(replacement);
      const mailOption: MailSettings = {
        from: 'blanja-app@blanja.com',
        to: recipient,
        subject: 'User Verification',
        html: html,
      };
      const info = await transporter.sendMail(mailOption);
      return info;
    } catch (e) {
      throw e;
    }
  }
}
