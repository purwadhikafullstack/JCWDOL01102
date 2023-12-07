import { Op, WhereOptions } from 'sequelize';
import { BadRequestException } from '../../helper/Error/BadRequestException/BadRequestException';
import { NotFoundException } from '../../helper/Error/NotFound/NotFoundException';
import Users, { UserAttributes, UserCreationAttributes } from '../../database/models/user.model';
import Roles from '../../database/models/role.model';
import Permissions from '../../database/models/permission.model';
import Branch from '../../database/models/branch.model';

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

  async page(page: number, limit: number, roleId: number) {
    try {
      const users = await Users.paginate({
        page,
        limit,
        searchConditions: [
          {
            keySearch: 'role_id',
            keyValue: roleId.toString(),
            operator: Op.lte,
            keyColumn: 'role_id',
          },
        ],
        includeConditions: [
          {
            model: Roles,
            as: 'role',
            attributes: ['role'],
          },
          {
            model: Branch,
            as: 'branch',
            attributes: ['name'],
          },
        ],
        attributes: ['id', 'name', 'branch_id', 'email'],
      });
      return users;
    } catch (error: any) {
      throw new BadRequestException(`Error paginating users: ${error.message}`);
    }
  }
}
