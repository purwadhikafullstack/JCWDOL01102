import { Request, Response } from 'express';
import { HttpStatusCode } from 'axios';
import { ProcessError } from '../../helper/Error/errorHandler';
import { IResponse } from '../interface';
import PromotionService from '../../service/promotion/promotion.service';
import { PromotionCreationAttributes, PromotionUpdateAttributes } from '../../database/models/promotion.model';

export default class PromotionController {
  private promotionService: PromotionService;
  constructor() {
    this.promotionService = new PromotionService();
  }

  async create(req: Request, res: Response<IResponse<PromotionCreationAttributes>>) {
    try {
      console.log(req.body);
      const promotion = await this.promotionService.create(req.body);
      res.status(HttpStatusCode.Ok).send({
        statusCode: HttpStatusCode.Ok,
        message: 'Promotion has been created successfully',
        data: promotion,
      });
    } catch (e) {
      ProcessError(e, res);
    }
  }

  async update(req: Request, res: Response<IResponse<PromotionUpdateAttributes>>) {
    try {
      const { id } = req.params;
      await this.promotionService.updateById(Number(id), req.body);
      res.status(HttpStatusCode.Ok).send({
        statusCode: HttpStatusCode.Ok,
        message: 'Promotion has been Updated successfully',
      });
    } catch (e) {
      ProcessError(e, res);
    }
  }

  async delete(req: Request, res: Response<IResponse<PromotionCreationAttributes>>) {
    try {
      const { id } = req.params;
      await this.promotionService.delete(Number(id));
      res.status(HttpStatusCode.Ok).send({
        statusCode: HttpStatusCode.Ok,
        message: 'Promotion has been Deleted successfully',
      });
    } catch (e) {
      ProcessError(e, res);
    }
  }
  async page(req: Request, res: Response) {
    try {
      if (!req.query.page || !req.query.limit) {
        return res.status(HttpStatusCode.BadRequest).send({
          statusCode: HttpStatusCode.BadRequest,
          message: 'bad request',
        });
      }
      const page = Number(req.query.page);
      const limit = Number(req.query.limit);
      const key = req.query.key ? String(req.query.key) : undefined;
      const sortBy = req.query.sortBy ? String(req.query.sortBy) : undefined;
      const filterBy = req.query.filterBy ? Number(req.query.filterBy) : undefined;
      const vouchers = await this.promotionService.page(page, limit, sortBy, filterBy, key);

      return res.status(HttpStatusCode.Ok).send({
        statusCode: HttpStatusCode.Ok,
        message: 'Pagination success',
        data: vouchers,
      });
    } catch (e) {
      ProcessError(e, res);
    }
  }
}
