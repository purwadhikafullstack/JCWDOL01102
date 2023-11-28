import { Request, Response } from 'express';
import ProductService from '../../service/products/product.service';
import { ProcessError } from '../../helper/Error/errorHandler';
import { HttpStatusCode } from 'axios';
import { IResponse } from '../interface';
import Product from '../../database/models/products.model';
import { messages } from '../../config/message';

export default class ProductController {
  productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  async createProduct(req: Request, res: Response<IResponse<Product>>) {
    try {
      const file = req.file as Express.Multer.File;
      const product = await this.productService.createProduct(file, req.body);
      res.status(HttpStatusCode.Created).json({
        statusCode: HttpStatusCode.Created,
        message: messages.CREATED,
        data: product,
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }
}
