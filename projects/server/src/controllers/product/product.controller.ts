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

  async page(req: Request, res: Response<IResponse<any>>) {
    try {
      const { page, limit } = req.query;
      const products = await this.productService.page(Number(page), Number(limit), Number('1'), req.query);
      res.status(HttpStatusCode.Ok).json({
        statusCode: HttpStatusCode.Ok,
        message: messages.SUCCESS,
        data: products,
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }

  async updateProduct(req: Request, res: Response<IResponse<any>>) {
    try {
      const { id } = req.params;
      const product = await this.productService.updateById(Number(id), 1, req.body);
      res.status(HttpStatusCode.Ok).json({
        statusCode: HttpStatusCode.Ok,
        message: messages.SUCCESS,
        data: product,
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }
  async deleteProduct(req: Request, res: Response<IResponse<any>>) {
    try {
      const { id } = req.params;
      const product = await this.productService.deleteById(Number(id), 1);
      res.status(HttpStatusCode.NoContent).json({
        statusCode: HttpStatusCode.NoContent,
        message: messages.SUCCESS,
        data: product,
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }

  async getProductById(req: Request, res: Response<IResponse<any>>) {
    try {
      const { id } = req.params;
      const product = await this.productService.getById(Number(id), 1);
      res.status(HttpStatusCode.Ok).json({
        statusCode: HttpStatusCode.Ok,
        message: messages.SUCCESS,
        data: product,
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }

  async updateWithImageById(req: Request, res: Response<IResponse<any>>) {
    try {
      const { id } = req.params;
      const file = req.file as Express.Multer.File;
      const product = await this.productService.updateWithImage(file, Number(id), 1, req.body);
      res.status(HttpStatusCode.Ok).json({
        statusCode: HttpStatusCode.Ok,
        message: messages.SUCCESS,
        data: product,
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }
}
