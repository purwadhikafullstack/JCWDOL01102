import { HttpStatusCode } from 'axios';
import { CategoryService } from '../../service/category/category.service';
import { IResponse } from '../interface';
import Category from '../../database/models/category.model';
import { messages } from '../../config/message';
import { ProcessError } from '../../helper/Error/errorHandler';
import { Request, Response } from 'express';

export class CategoryController {
  categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  async createCategory(req: Request, res: Response<IResponse<Category>>) {
    try {
      const category = await this.categoryService.createCategory(req.user.branchId, req.body);
      res.status(HttpStatusCode.Created).json({
        statusCode: HttpStatusCode.Created,
        message: messages.CREATED,
        data: category,
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }

  async updateCategory(req: Request, res: Response<IResponse<any>>) {
    try {
      const { id } = req.params;
      const category = await this.categoryService.updateById(Number(id), req.user.branchId, req.body);
      res.status(HttpStatusCode.Ok).json({
        statusCode: HttpStatusCode.Ok,
        message: messages.SUCCESS,
        data: category,
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }

  async deleteCategory(req: Request, res: Response<IResponse<any>>) {
    try {
      const { id } = req.params;
      const category = await this.categoryService.deleteById(Number(id), req.user.branchId);
      res.status(HttpStatusCode.Ok).json({
        statusCode: HttpStatusCode.Ok,
        message: messages.SUCCESS,
        data: category,
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }

  async allCategory(req: Request, res: Response<IResponse<any>>) {
    try {
      const categories = await this.categoryService.allCategory(req.user.branchId);
      res.status(HttpStatusCode.Ok).json({
        statusCode: HttpStatusCode.Ok,
        message: messages.SUCCESS,
        data: categories,
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }

  async page(req: Request, res: Response<IResponse<any>>) {
    try {
      const { page, limit } = req.query;
      const categories = await this.categoryService.page(
        Number(page ?? 1),
        Number(limit ?? 10),
        req.user.branchId,
        req.query
      );
      res.status(HttpStatusCode.Ok).json({
        statusCode: HttpStatusCode.Ok,
        message: messages.SUCCESS,
        data: categories,
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }

  async getCategoryById(req: Request, res: Response<IResponse<any>>) {
    try {
      const { id } = req.params;
      const category = await this.categoryService.findById(Number(id), req.user.branchId);
      res.status(HttpStatusCode.Ok).json({
        statusCode: HttpStatusCode.Ok,
        message: messages.SUCCESS,
        data: category,
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }
}
