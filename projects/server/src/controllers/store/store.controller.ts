import { NextFunction, Request, Response } from 'express';
import StoreService from '../../service/store/store.service';
import { IResponse } from '../interface';
import { ProcessError } from '../../helper/Error/errorHandler';
import { HttpStatusCode } from 'axios';
import { Includeable } from 'sequelize';
import Promotions from '../../database/models/promotion.model';
import { Op } from 'sequelize';
import { sortOptions } from '../../database/models/base.model';
import { messages } from '../../config/message';
import ProductService from '../../service/products/product.service';

export default class StoreController {
  private storeService: StoreService;
  private productService: ProductService;
  constructor() {
    this.storeService = new StoreService();
    this.productService = new ProductService();
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

  async categories(req: Request, res: Response<IResponse<any>>, next: NextFunction) {
    try {
      if (req.query.limit) {
        return next();
      }
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

  async getAllCategoriesWithLimit(req: Request, res: Response<IResponse<any>>) {
    try {
      const { branchId, limit } = req.query;
      const categories = await this.storeService.findAllCategoriesWithLimit(Number(limit), Number(branchId));
      res.status(HttpStatusCode.Ok).json({
        statusCode: HttpStatusCode.Ok,
        message: messages.SUCCESS,
        data: categories,
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }

  async ProductPagination(req: Request, res: Response<IResponse<any>>) {
    try {
      const { page, limit } = req.query;
      const sortOption: sortOptions = {
        key: req.query.sortBy as string,
        order: req.query.order as string,
      };
      let includeOptions: Includeable[] | undefined = undefined;
      if (req.query.includePromotion === 'true') {
        includeOptions = [
          {
            model: Promotions,
            as: 'promotion',
            order: [['id', 'DESC']],
            limit: 1,
            where: {
              [Op.and]: {
                dateStart: { [Op.lte]: new Date() },
                dateEnd: { [Op.gte]: new Date() },
              },
            },
          },
        ];
      }
      const products = await this.productService.page(
        Number(page),
        Number(limit),
        Number(req.query.branchId),
        req.query,
        sortOption,
        includeOptions
      );
      res.status(HttpStatusCode.Ok).json({
        statusCode: HttpStatusCode.Ok,
        message: messages.SUCCESS,
        data: products,
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }
}
