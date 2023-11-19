/* eslint-disable no-useless-catch */
import { Op } from 'sequelize';
import Configs, { ConfigCreationAttributes } from '../../database/models/configs.model';
import { UnprocessableEntityException } from '../../helper/Error/UnprocessableEntity/UnprocessableEntityException';
import { IRequestConfig } from './interface/interface';
import { NotFoundException } from '../../helper/Error/NotFound/NotFoundException';

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

  async deleteConfigById(id: number): Promise<any> {
    const checkExist = await Configs.findOne({
      where: {
        id,
        deletedAt: null,
      },
    });
    if (!checkExist) {
      throw new NotFoundException('Config not found', {
        id,
      });
    }
    return await Configs.softDeleteById(id);
  }

  async deleteConfig(input: IRequestConfig): Promise<any> {
    const checkExist = await Configs.findOne({
      where: {
        module: input.module,
        name: input.name,
        deletedAt: null,
      },
    });
    if (!checkExist) {
      throw new NotFoundException('Config not found', {
        ...input,
      });
    }
    return await Configs.softDelete({
      module: input.module,
      name: input.name,
    });
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
