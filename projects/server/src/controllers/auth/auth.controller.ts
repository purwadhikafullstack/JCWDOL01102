import { Request, Response } from 'express';
import { UserAttributes, UserCreationAttributes } from '../../database/models/user.model';
import { IResponse, IUserBodyReq } from '../interface';
import bcrypt from 'bcrypt';
import generateReferral from '../../helper/function/generatReferral';
import { v4 as uuidV4 } from 'uuid';
import UserService from '../../service/users/user.service';
import { HttpStatusCode } from 'axios';
import { ProcessError } from '../../helper/Error/errorHandler';
export default class authController {
  private userServices: UserService;

  constructor() {
    this.userServices = new UserService();
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
}
