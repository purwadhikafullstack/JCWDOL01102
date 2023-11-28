import { Op } from 'sequelize';
import Documents, { DocumentCreationAttributes } from '../../database/models/document.model';
import { NotFoundException } from '../../helper/Error/NotFound/NotFoundException';
import { v4 as uuidv4 } from 'uuid';
import MinioService from '../minio.service';
import * as fs from 'fs';
export default class DocumentService {
  minioService: MinioService;

  constructor() {
    this.minioService = new MinioService();
  }

  async createDocument(input: DocumentCreationAttributes): Promise<Documents> {
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

  async updateDocument(id: number, input: Partial<DocumentCreationAttributes>): Promise<DocumentCreationAttributes> {
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

  async uploadDocument(file: Express.Multer.File, type: string): Promise<Documents> {
    // eslint-disable-next-line no-useless-catch
    try {
      const fileName = `${uuidv4()}-${file.originalname}`;
      const path = await this.getPath(type);
      const pathName = `${path}${fileName}`;
      const bucketName = process.env.BUCKET_NAME ?? 'grocery';
      const uniqueId = uuidv4();

      await this.minioService.uploadFile(file, pathName, bucketName);
      const document = await this.createDocument({
        bucketName,
        fileName,
        pathName,
        uniqueId,
      });
      fs.unlinkSync(file.path);
      return document;
    } catch (error) {
      fs.unlinkSync(file.path);
      throw error;
    }
  }

  async getFileById(id: string) {
    const document = await Documents.findOne({ where: { uniqueId: id } });
    if (!document) throw new NotFoundException('Document not found', {});
    const bucketName = document.bucketName;
    const pathName = document.pathName;
    const file = await this.minioService.getBuffer(bucketName, pathName);
    return file;
  }

  async getPath(type: string) {
    switch (type) {
      case 'product':
        return 'product/';
      case 'profile':
        return 'profile/';
      default:
        return 'general/';
    }
  }
}
