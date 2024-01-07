import { Request, Response } from 'express';
import StoreService from '../../service/store/store.service';
import { IResponse } from '../interface';
import { ProcessError } from '../../helper/Error/errorHandler';
import { HttpStatusCode } from 'axios';

export default class StoreController {
  private storeService: StoreService;

  constructor() {
    this.storeService = new StoreService();
  }

  async recomendation(req: Request, res: Response<IResponse<any>>) {
    try {
      const { branchId } = req.query;
      const products = await this.storeService.recomendation(Number(branchId));
      res.status(HttpStatusCode.Ok).json({
        statusCode: HttpStatusCode.Ok,
        message: 'product recomndation success',
        data: products,
      });
    } catch (e) {
      ProcessError(e, res);
    }
  }

  async categories(req: Request, res: Response<IResponse<any>>) {
    try {
      const { branchId } = req.query;
      const categories = await this.storeService.categories(Number(branchId));
      res.status(HttpStatusCode.Ok).json({
        statusCode: HttpStatusCode.Ok,
        message: 'Categories recomndation success',
        data: categories,
      });
    } catch (e) {
      ProcessError(e, res);
    }
  }
}
