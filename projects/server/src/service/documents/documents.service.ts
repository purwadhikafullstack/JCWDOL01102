import { Op } from 'sequelize';
import Documents, { DocumentCreationAttributes } from '../../database/models/document.model';
import { NotFoundException } from '../../helper/Error/NotFound/NotFoundException';

export default class DocumentService {
  async createDocument(input: DocumentCreationAttributes): Promise<any> {
    try {
      const user = await Documents.create(input);
      return user;
    } catch (error: any) {
      throw new Error(`Error creating Document: ${error.message}`);
    }
  }

  async getDocument(id: number): Promise<any> {
    try {
      const users = await Documents.findOne({ where: { id: id } });
      return users;
    } catch (error: any) {
      throw new Error(`Error getting Document: ${error.message}`);
    }
  }

  async deleteDocument(id: number) {
    // eslint-disable-next-line no-useless-catch
    try {
      const user = await Documents.softDeleteById(id);
      if (!user) throw new NotFoundException('Users not found', {});
      return user;
    } catch (error: any) {
      throw error;
    }
  }

  async updateDocument(id: number, input: Partial<DocumentCreationAttributes>): Promise<Documents> {
    // eslint-disable-next-line no-useless-catch
    try {
      const user = await Documents.updateById(id, input);
      if (!user) throw new NotFoundException('Users not found', {});
      return user;
    } catch (error: any) {
      throw error;
    }
  }

  async paginate(): Promise<any> {
    return await Documents.paginate(1, 10, [
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
