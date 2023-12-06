/* eslint-disable no-useless-catch */
import { Op } from 'sequelize';
import Branch from '../../database/models/branch.model';
import Category from '../../database/models/category.model';
import Product from '../../database/models/products.model';
import { UnprocessableEntityException } from '../../helper/Error/UnprocessableEntity/UnprocessableEntityException';
import DocumentService from '../documents/documents.service';
import { IRequestProduct } from './interface/interfaces';
import configConstants from '../../config/constants';
import { sortOptions } from '../../database/models/base.model';
export default class ProductService {
  documentService: DocumentService;

  constructor() {
    this.documentService = new DocumentService();
  }

  async createProduct(file: Express.Multer.File, input: IRequestProduct) {
    try {
      if (!file)
        throw new UnprocessableEntityException('Image is required', {
          image: 'Image is required',
        });
      const branch = await Branch.findOne({ where: { id: input.branchId } });
      if (!branch)
        throw new UnprocessableEntityException('Branch not found', {
          branchId: 'Branch not found',
        });
      const category = await Category.findOne({ where: { id: input.categoryId, branchId: branch.id } });
      if (!category)
        throw new UnprocessableEntityException('Category not found', {
          categoryId: 'Category not found',
        });
      const document = await this.documentService.uploadDocument(file, 'product');
      if (!document.id)
        throw new UnprocessableEntityException('Error uploading document', {
          document: 'Error uploading document',
        });
      const product = await Product.create({
        ...input,
        imageId: document.id,
      });
      return product;
    } catch (error) {
      throw error;
    }
  }

  async page(page: number, limit: number, branchId: number, data: any, sortOptions?: sortOptions) {
    try {
      const products = await Product.paginate({
        page,
        limit,
        searchConditions: [
          {
            keySearch: 'name',
            keyValue: data.name,
            operator: Op.substring,
            keyColumn: 'name',
          },
          {
            keySearch: 'categoryId',
            keyValue: data.categoryId,
            operator: data.categoryId ? Op.eq : Op.ne,
            keyColumn: 'categoryId',
          },
          {
            keySearch: 'branchId',
            keyValue: branchId.toString(),
            operator: Op.eq,
            keyColumn: 'branchId',
          },
        ],
        sortOptions,
      });

      return {
        ...products,
        data: await Promise.all(
          products.data.map(async (product) => {
            return await this.buildResponsePayload(product.toJSON());
          })
        ),
      };
    } catch (error) {
      throw error;
    }
  }

  async buildResponsePayload(product: Product) {
    const document = await this.documentService.getDocument(product.imageId);
    const category = await Category.findOne({ where: { id: product.categoryId } });
    return {
      ...product,
      imageUrl: `${configConstants.API_URL}/api/document/${document?.uniqueId}`,
      category: category,
    };
  }

  async updateById(id: number, branchId: number, input: Partial<IRequestProduct>) {
    try {
      const product = await Product.findOne({ where: { id, branchId } });
      if (!product) throw new UnprocessableEntityException('Product not found', { id: 'Product not found' });
      await product.update(input);
      return product;
    } catch (error) {
      throw error;
    }
  }

  async deleteById(id: number, branchId: number) {
    try {
      const product = await Product.findOne({ where: { id, branchId } });
      if (!product) throw new UnprocessableEntityException('Product not found', { id: 'Product not found' });
      await product.destroy();
      return product;
    } catch (error) {
      throw error;
    }
  }

  async getById(id: number, branchId: number) {
    try {
      const product = await Product.findOne({ where: { id, branchId } });
      if (!product) throw new UnprocessableEntityException('Product not found', { id: 'Product not found' });
      return await this.buildResponsePayload(product.toJSON());
    } catch (error) {
      throw error;
    }
  }

  async updateWithImage(file: Express.Multer.File, id: number, branchId: number, input: Partial<IRequestProduct>) {
    try {
      const product = await Product.findOne({ where: { id, branchId } });
      if (!product) throw new UnprocessableEntityException('Product not found', { id: 'Product not found' });
      const document = await this.documentService.uploadDocument(file, 'product');
      if (!document.id)
        throw new UnprocessableEntityException('Error uploading document', {
          document: 'Error uploading document',
        });
      await product.update({
        ...input,
        imageId: document.id,
      });
      return product;
    } catch (error) {
      throw error;
    }
  }
}
