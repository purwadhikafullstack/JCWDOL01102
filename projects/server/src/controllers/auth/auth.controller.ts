import { Request, Response } from 'express';
import { ILoginResponse, IMailerResponse, IResponse } from '../interface';
import { HttpStatusCode } from 'axios';
import { ProcessError } from '../../helper/Error/errorHandler';
import AuthService from '../../service/auth/auth.service';
import MailerService from '../../service/nodemailer.service';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { messages } from '../../config/message';
import { NotFoundException } from '../../helper/Error/NotFound/NotFoundException';
export default class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async sendEmail(req: Request, res: Response<IResponse<IMailerResponse>>) {
    try {
      const email = req.query.email as string;
      const name = req.query.name as string;
      const verifyToken = req.query.verifyToken as string;
      const emailService = new MailerService();
      const info: SMTPTransport.SentMessageInfo = await emailService.sendEmail(verifyToken, email, name);
      res.status(HttpStatusCode.Ok).send({
        statusCode: HttpStatusCode.Ok,
        message: 'Email was successfully sent',
        data: {
          to: email,
          message: info.response,
          status: 'sent',
        },
      });
    } catch (e: any) {
      ProcessError(e, res);
    }
  }
  async verify(req: Request, res: Response<IResponse<any>>) {
    try {
      const verifyToken = req.body.verifyToken;
      const result = await this.authService.updateByVerifyToken(verifyToken, { isVerified: true });

      res.status(HttpStatusCode.Ok).send({
        statusCode: HttpStatusCode.Ok,
        message: messages.SUCCESS,
        data: result ?? {},
      });
    } catch (err) {
      ProcessError(err, res);
    }
  }
  async Login(req: Request, res: Response<IResponse<ILoginResponse>>) {
    try {
      const result = await this.authService.login(req.body);
      if (!result) {
        return res.status(HttpStatusCode.NotFound).send({
          statusCode: HttpStatusCode.NotFound,
          message: 'Username or Password is incorrect',
        });
      }
      res.status(HttpStatusCode.Ok).send({
        statusCode: HttpStatusCode.Ok,
        message: 'Login successfull',
        data: {
          token: result.token,
          user: result.user,
        },
      });
    } catch (e) {
      if (e instanceof NotFoundException) {
        return res.status(HttpStatusCode.Unauthorized).send({
          statusCode: HttpStatusCode.Unauthorized,
          message: 'Email or Password is incorrect',
        });
      }
      ProcessError(e, res);
    }
  }
}
