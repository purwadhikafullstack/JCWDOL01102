/// <reference path="../custom.d.ts" />
import UserService from '../../service/users/user.service';
import { HttpStatusCode } from 'axios';
import { ProcessError } from '../../helper/Error/errorHandler';
import { BadRequestException } from '../../helper/Error/BadRequestException/BadRequestException';
import Users, { UserAttributes, UserCreationAttributes } from '../../database/models/user.model';
import { Request, Response } from 'express';
import { ICheckEmail, ILoginResponse, IMailerResponse, IResponse, IUserBodyReq } from '../interface';
import { messages } from '../../config/message';
import generateReferral from '../../helper/function/generatReferral';
import bcrypt from 'bcrypt';
import { NotFoundException } from '../../helper/Error/NotFound/NotFoundException';
import MailerService from '../../service/nodemailer.service';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import JWTService from '../../service/jwt/jwt.service';
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

      const newUserAttr: UserCreationAttributes = {
        ...attr,
        referralCode,
        isDeleted: false,
        isVerified: false,
        birthdate: null,
        resetPasswordToken: null,
        verifyToken,
        createdAt: null,
        updatedAt: null,
        deletedAt: null,
      };

      const user = await this.userServices.create(newUserAttr);

      res.status(HttpStatusCode.Ok).send({
        statusCode: HttpStatusCode.Ok,
        message: 'User has been created succesfully',
        data: user ?? {},
      });
    } catch (err) {
      ProcessError(err, res);
    }
  }
  async findUserByEmail(req: Request, res: Response<IResponse<ICheckEmail>>) {
    try {
      const email = req.query.email;
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

  async findUserByRoleId(req: Request, res: Response<IResponse<UserAttributes>>) {
    try {
      const role_id = req.query.role_id;
      console.log(role_id);
      // const user = await this.userServices.gets({[Op.and] : [{role_id : role_id?.[0]}]})
      res.status(HttpStatusCode.Ok).send({
        statusCode: HttpStatusCode.Ok,
        message: 'heu',
      });
    } catch (err: any) {
      if (err instanceof NotFoundException) {
        return res.status(HttpStatusCode.Ok).send({
          statusCode: HttpStatusCode.Ok,
          message: 'Email is available',
        });
      }
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
      const email = req.body.email;
      const pass = req.body.password;
      const user = await this.userServices.getUserDetalInfo({ email: email });
      const userJson = user.toJSON();
      const matches = await bcrypt.compare(pass, user.password);
      if (!matches) {
        return res.status(HttpStatusCode.Unauthorized).send({
          statusCode: HttpStatusCode.Unauthorized,
          message: 'Email or Password is incorrect',
        });
      }
      const perm = userJson.role?.permission?.map((data) => data.permission);
      const respObj = {
        name: userJson.name,
        email: userJson.email,
        phoneNumber: userJson.phoneNumber,
        referralCode: userJson.referralCode,
        role: userJson.role!.role,
        permission: perm,
      };

      const jwtServie = new JWTService();
      const token = await jwtServie.generateToken(respObj);

      res.status(HttpStatusCode.Ok).send({
        statusCode: HttpStatusCode.Ok,
        message: 'Login successfull',
        data: {
          email: user.email,
          token: token,
        },
      });
    } catch (e) {
      console.log(e);
      if (e instanceof NotFoundException) {
        return res.status(HttpStatusCode.Unauthorized).send({
          statusCode: HttpStatusCode.Unauthorized,
          message: 'Email or Password is incorrect',
        });
      }
      ProcessError(e, res);
    }
  }
  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (!id) throw new BadRequestException('Invalid id', {});
      const affectedRows = await this.userServices.deleteById(id);
      res.status(HttpStatusCode.Ok).json({
        affectedRows: affectedRows || 0,
      });
    } catch (err) {
      ProcessError(err, res);
    }
  }
}
