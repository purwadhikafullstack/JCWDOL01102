/* eslint-disable no-useless-catch */
import { Op } from 'sequelize';
import Configs, { ConfigCreationAttributes } from '../../database/models/configs.model';
import { UnprocessableEntityException } from '../../helper/Error/UnprocessableEntity/UnprocessableEntityException';
import { IRequestConfig } from './interface/interface';

export default class ConfigServie {
  async getConfig(module: string, name: string): Promise<any> {
    try {
      const result = await Configs.findOne({
        where: {
          module,
          name,
        },
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async createConfig(input: IRequestConfig): Promise<any> {
    try {
      const checkExist = await Configs.findOne({
        where: {
          module: input.module,
          name: input.name,
        },
      });
      if (checkExist) {
        throw new UnprocessableEntityException('Config already exists', {
          ...input,
        });
      }
      const result = await Configs.create({
        ...input,
      } as ConfigCreationAttributes);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async updateConfig(input: IRequestConfig, id: number): Promise<any> {
    return await Configs.updateById(id, input);
  }

  async deleteConfig(id: number): Promise<any> {
    return await Configs.softDeleteById(id);
  }

  async paginate(): Promise<any> {
    return await Configs.paginate(1, 10, [
      {
        keySearch: 'module',
        keyValue: '123',
        operator: Op.substring,
      },
      {
        keySearch: 'name',
        keyValue: '123',
        operator: Op.substring,
      },
      {
        keySearch: 'startDate',
        keyValue: '123',
        operator: Op.gte,
        keyColumn: 'createdAt',
      },
      {
        keySearch: 'endDate',
        keyValue: '123',
        operator: Op.lte,
        keyColumn: 'createdAt',
      },
    ]);
  }
}
