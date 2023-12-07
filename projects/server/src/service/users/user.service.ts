import { Op, WhereOptions } from 'sequelize';
import { BadRequestException } from '../../helper/Error/BadRequestException/BadRequestException';
import { NotFoundException } from '../../helper/Error/NotFound/NotFoundException';
import Users, { UserAttributes, UserCreationAttributes } from '../../database/models/user.model';
import Roles from '../../database/models/role.model';
import Permissions from '../../database/models/permission.model';
import Branch from '../../database/models/branch.model';
import bcrypt from 'bcrypt';
import JWTService from '../jwt/jwt.service';
export default class UserService {
  async create(input: UserCreationAttributes) {
    try {
      const user = await Users.create(input);
      return user;
    } catch (error: any) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  async gets(conditions: Partial<UserCreationAttributes> | WhereOptions<UserAttributes>) {
    try {
      const users = await Users.findAll({ where: conditions });
      return users;
    } catch (error: any) {
      throw new Error(`Error getting users: ${error.message}`);
    }
  }

  async login(input: Partial<UserCreationAttributes>) {
    try {
      const email = input.email;
      const pass = input.password;
      const user = await this.getUserDetalInfo({ email: email });
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
      return token;
    } catch (e: any) {
      throw new Error(`Login Error : ${e.message}`);
    }
  }
  async getUserDetalInfo(conditions: Partial<UserCreationAttributes>) {
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
            attributes: ['name'],
          },
        ],
      });
      if (!user) throw new NotFoundException('Users not found', {});
      return user;
    } catch (error: any) {
      throw new Error(`Error getting users: ${error.message}`);
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

  async getById(id: number) {
    // eslint-disable-next-line no-useless-catch
    try {
      const user = await Users.findByPk(id);
      if (!user) throw new NotFoundException('Users not found', {});
      return user;
    } catch (error: any) {
      throw error;
    }
  }

  async deleteById(id: number) {
    // eslint-disable-next-line no-useless-catch
    try {
      const user = await Users.softDeleteById(id);
      if (!user) throw new NotFoundException('Users not found', {});
      return user;
    } catch (error: any) {
      throw error;
    }
  }

  async updateById(id: number, input: Partial<UserCreationAttributes>): Promise<Users> {
    // eslint-disable-next-line no-useless-catch
    try {
      const user = await Users.updateById<UserAttributes>(id, input);
      if (!user) throw new NotFoundException('Users not found', {});
      const result = await this.getById(id);
      return result;
    } catch (error: any) {
      throw error;
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

  async updateByEmail(email: string, input: Partial<UserCreationAttributes>): Promise<Users> {
    // eslint-disable-next-line no-useless-catch
    try {
      const user = await Users.update(input, { where: { email } });
      if (!user) throw new NotFoundException('Users not found', {});
      const result = await this.findOne({ email: email });
      return result;
    } catch (error: any) {
      throw error;
    }
  }

  async page(page: number, limit: number, sortBy?: string, filterBy?: number, key?: string) {
    try {
      console.log(sortBy);
      console.log(filterBy);
      const users = await Users.paginate({
        page,
        limit,
        searchConditions: [
          {
            keySearch: 'name',
            keyValue: key!,
            operator: Op.like,
            keyColumn: 'name',
          },
        ],
        includeConditions: [
          {
            model: Roles,
            as: 'role',
            attributes: ['role'],
            where: filterBy ? { id: filterBy } : undefined,
          },
          {
            model: Branch,
            as: 'branch',
            attributes: ['name'],
          },
        ],
        sortOptions: sortBy ? { key: 'name', order: sortBy } : undefined,
        attributes: ['id', 'name', 'branch_id', 'email'],
      });
      return users;
    } catch (error: any) {
      throw new BadRequestException(`Error paginating users: ${error.message}`);
    }
  }
}
