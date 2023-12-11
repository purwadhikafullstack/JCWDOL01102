/// <reference path="../custom.d.ts" />
import UserService from '../../service/users/user.service';
import { HttpStatusCode } from 'axios';
import { ProcessError } from '../../helper/Error/errorHandler';
import { BadRequestException } from '../../helper/Error/BadRequestException/BadRequestException';
import Users, { UserAttributes, UserCreationAttributes } from '../../database/models/user.model';
import { NextFunction, Request, Response } from 'express';
import { ICheckEmail, ILoginResponse, IMailerResponse, IResponse, IUserBodyReq } from '../interface';
import { messages } from '../../config/message';
import generateReferral from '../../helper/function/generatReferral';
import bcrypt from 'bcrypt';
import { NotFoundException } from '../../helper/Error/NotFound/NotFoundException';
import MailerService from '../../service/nodemailer.service';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { v4 as uuidV4 } from 'uuid';
import { Op } from 'sequelize';

export class UserController {
  private userServices: UserService;

  constructor() {
    this.userServices = new UserService();
  }
  async read(req: Request, res: Response<IResponse<UserAttributes>>) {
    try {
      const id = Number(req.params.id);
      if (!id) throw new BadRequestException('Invalid id', {});
      const user = await this.userServices.getById(id);
      res.status(HttpStatusCode.Ok).send({
        statusCode: HttpStatusCode.Ok,
        message: messages.SUCCESS,
        data: user ?? {},
      });
      // res.json(userObject);
    } catch (err) {
      ProcessError(err, res);
    }
  }

  async create(req: Request, res: Response<IResponse<UserAttributes>>) {
    try {
      const attr: IUserBodyReq = req.body;
      const hashedPass = await bcrypt.hash(attr.password, 10);
      attr.password = hashedPass;
      let referralCode = '';
      let verifyToken = '';
      let userRefferal = {};
      let userVerifyToken = {};

      if (!attr.branch_id) {
        while (userRefferal && userVerifyToken) {
          try {
            referralCode = generateReferral(6);
            verifyToken = uuidV4();
            userRefferal = await this.userServices.findOne({ referralCode: referralCode });
            userVerifyToken = await this.userServices.findOne({ verifyToken: verifyToken });
          } catch (e) {
            break;
          }
        }
      }

      const newUserAttr: UserCreationAttributes = {
        ...attr,
        referralCode: !attr.branch_id ? referralCode : '',
        address: '',
        isDeleted: false,
        isVerified: !attr.branch_id ? false : true,
        birthdate: null,
        resetPasswordToken: null,
        verifyToken: !attr.branch_id ? verifyToken : '',
        createdAt: null,
        updatedAt: null,
        deletedAt: null,
      };

      const user = await this.userServices.create(newUserAttr);

      res.status(HttpStatusCode.Ok).send({
        statusCode: HttpStatusCode.Ok,
        message: !attr.branch_id ? 'User has been created succesfully' : 'Admin has been created succesfully',
        data: user ?? {},
      });
    } catch (err) {
      ProcessError(err, res);
    }
  }

  async findUserByEmail(req: Request, res: Response<IResponse<ICheckEmail>>, next: NextFunction) {
    try {
      const email = req.query.email;
      if (!email) return next();
      await this.userServices.findOne({ email: email as string });
      res.status(HttpStatusCode.Ok).send({
        statusCode: HttpStatusCode.Ok,
        message: 'Email is already in use',
        data: {
          available: false,
        },
      });
    } catch (err: any) {
      if (err instanceof NotFoundException) {
        return res.status(HttpStatusCode.Ok).send({
          statusCode: HttpStatusCode.Ok,
          message: 'Email is available',
          data: {
            available: true,
          },
        });
      }
      ProcessError(err, res);
    }
  }

  async page(req: Request, res: Response<IResponse<any>>) {
    try {
      if (!req.query.page || !req.query.limit) {
        return res.status(HttpStatusCode.BadRequest).send({
          statusCode: HttpStatusCode.BadRequest,
          message: 'bad request',
        });
      }
      const page = Number(req.query.page);
      const limit = Number(req.query.limit);
      const key = req.query.key ? String(req.query.key) : undefined;
      const sortBy = req.query.sortBy ? String(req.query.sortBy) : undefined;
      const filterBy = req.query.filterBy ? Number(req.query.filterBy) : undefined;
      const users = await this.userServices.page(page, limit, sortBy, filterBy, key);

      return res.status(HttpStatusCode.Ok).send({
        statusCode: HttpStatusCode.Ok,
        message: 'Pagination success',
        data: users,
      });
    } catch (e) {
      ProcessError(e, res);
    }
  }
  async findUserByRoleId(req: Request, res: Response<IResponse<UserAttributes>>, next: NextFunction) {
    try {
      if (!req.query.role_id) return next();
      const roleId: string[] = (req.query.role_id as string[]) || [];
      const roleIdNum = roleId.map((val) => Number(val));

      const users = await this.userServices.gets({
        role_id: {
          [Op.in]: roleIdNum,
        },
      });

      return res.status(HttpStatusCode.Ok).send({
        statusCode: HttpStatusCode.Ok,
        message: messages.SUCCESS,
        data: users,
      });
    } catch (err: any) {
      ProcessError(err, res);
    }
  }
  async updateById(req: Request, res: Response<IResponse<Users>>) {
    try {
      const result = await this.userServices.updateById(Number(req.params.id), req.body);

      res.status(HttpStatusCode.Ok).send({
        statusCode: HttpStatusCode.Ok,
        message: messages.SUCCESS,
        data: result ?? {},
      });
    } catch (err) {
      ProcessError(err, res);
    }
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
      const result = await this.userServices.updateByVerifyToken(verifyToken, { isVerified: true });

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
      const result = await this.userServices.login(req.body);
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
  async delete(req: Request, res: Response<IResponse<UserAttributes>>) {
    try {
      const id = Number(req.params.id);
      if (!id) throw new BadRequestException('Invalid id', {});
      await this.userServices.deleteById(id);
      res.status(HttpStatusCode.Ok).send({
        statusCode: HttpStatusCode.Ok,
        message: 'Admin was successfully deleted',
      });
    } catch (err) {
      ProcessError(err, res);
    }
  }
}
