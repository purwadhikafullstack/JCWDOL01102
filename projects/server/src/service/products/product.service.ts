/* eslint-disable no-useless-catch */
import Branch from '../../database/models/branch.model';
import Category from '../../database/models/category.model';
import Product from '../../database/models/products.model';
import { UnprocessableEntityException } from '../../helper/Error/UnprocessableEntity/UnprocessableEntityException';
import DocumentService from '../documents/documents.service';
import { IRequestProduct } from './interface/interfaces';

export default class ProductService {
  documentService: DocumentService;

  constructor() {
    this.documentService = new DocumentService();
  }

  async createProduct(file: Express.Multer.File, input: IRequestProduct) {
    try {
      console.log(input);
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
}
