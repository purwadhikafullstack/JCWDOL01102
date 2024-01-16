import bcrypt from 'bcrypt';
import JWTService from '../jwt/jwt.service';
import Users, { UserAttributes, UserCreationAttributes } from '../../database/models/user.model';
import Roles from '../../database/models/role.model';
import Branch from '../../database/models/branch.model';
import Permissions from '../../database/models/permission.model';
import { NotFoundException } from '../../helper/Error/NotFound/NotFoundException';
import { ILoginResult } from '../users/interfaces/interfaces';

export default class AuthService {
  async login(input: Partial<UserCreationAttributes>) {
    try {
      const email = input.email;
      const pass = input.password;
      const user = await this.getUserDetailInfo({ email: email });
      const userJson = user.toJSON();
      const matches = await bcrypt.compare(pass!, user.password);
      if (!matches) {
        return '';
      }
      const perm = userJson.role?.permission?.map((data) => data.permission);
      const respObj = {
        name: userJson.name,
        email: userJson.email,
        branchId: userJson.branch_id,
        userId: userJson.id,
        phoneNumber: userJson.phoneNumber,
        referralCode: userJson.referralCode,
        role: userJson.role!.role,
        permission: perm,
        branch: userJson.branch,
      };

      const jwtServie = new JWTService();
      const token = await jwtServie.generateToken(respObj);
      return { token: token, user: respObj } as ILoginResult;
    } catch (e: any) {
      throw new Error(`Login Error : ${e.message}`);
    }
  }

  async getUserDetailInfo(conditions: Partial<UserCreationAttributes>) {
    try {
      const user = await Users.findOne({
        where: conditions,
        include: [
          {
            model: Roles,
            as: 'role',
            attributes: ['role'],
            include: [
              {
                model: Permissions,
                as: 'permission',
                attributes: ['permission'],
              },
            ],
          },
          {
            model: Branch,
            as: 'branch',
            attributes: ['name', 'id'],
          },
        ],
      });
      if (!user) throw new NotFoundException('Users not found', {});
      return user;
    } catch (error: any) {
      throw new Error(`Error getting users: ${error.message}`);
    }
  }

  async updateByVerifyToken(verifyToken: string, input: Partial<UserAttributes>): Promise<Users> {
    // eslint-disable-next-line no-useless-catch
    try {
      const user = await Users.update(input, { where: { verifyToken } });
      if (!user) throw new NotFoundException('Users not found', {});
      const result = await this.findOne({ verifyToken });
      return result;
    } catch (error: any) {
      throw error;
    }
  }

  async findOne(conditions: Partial<UserCreationAttributes>) {
    // eslint-disable-next-line no-useless-catch
    try {
      const user = await Users.findOne({ where: conditions });
      if (!user) throw new NotFoundException('Users not found', {});
      return user;
    } catch (error: any) {
      throw error;
    }
  }
}
