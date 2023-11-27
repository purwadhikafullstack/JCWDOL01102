import { Op } from 'sequelize';
import { BadRequestException } from '../../helper/Error/BadRequestException/BadRequestException';
import { NotFoundException } from '../../helper/Error/NotFound/NotFoundException';
import { removeLimitAndPage } from '../../helper/function/filteredData';
import { IPaginate } from '../../helper/interface/paginate/paginate.interface';
import Users, { UserAttributes, UserCreationAttributes } from '../../database/models/user.model';

export default class UserService {
  async create(input: UserCreationAttributes) {
    try {
      const user = await Users.create(input);
      return user;
    } catch (error: any) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  async gets(conditions: Partial<UserCreationAttributes>) {
    try {
      const users = await Users.findAll({ where: conditions });
      return users;
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

  async page(input: IPaginate<UserCreationAttributes>) {
    try {
      const page = input.page ?? 1;
      const limit = input.limit ?? 10;
      const offset = Math.max(page - 1, 0) * limit;
      const conditions = removeLimitAndPage(input.data);
      const users = await Users.findAndCountAll({
        where: {
          name: {
            [Op.like]: `%${conditions.name}%`,
          },
        },
        limit,
        offset: offset,
        order: [['id', 'DESC']],
      });
      return users;
    } catch (error: any) {
      throw new BadRequestException(`Error paginating users: ${error.message}`);
    }
  }
}
