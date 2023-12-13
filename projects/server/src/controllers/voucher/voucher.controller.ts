import { Request, Response } from 'express';
import VoucherService from '../../service/voucher/voucher.service';
import { HttpStatusCode } from 'axios';
import { ProcessError } from '../../helper/Error/errorHandler';
import { IResponse } from '../interface';
import { VoucherCreationAttributes } from '../../database/models/voucher.model';
///<reference path="./custom.d.ts" />

export default class VoucherController {
  private voucherService: VoucherService;
  constructor() {
    this.voucherService = new VoucherService();
  }

  async create(req: Request, res: Response<IResponse<VoucherCreationAttributes>>) {
    try {
      const { productId } = req.query;
      const voucher = await this.voucherService.create(Number(productId), req.body);
      res.status(HttpStatusCode.Ok).send({
        statusCode: HttpStatusCode.Ok,
        message: 'Voucher has been created successfully',
        data: voucher,
      });
    } catch (e) {
      ProcessError(e, res);
    }
  }

  async update(req: Request, res: Response<IResponse<VoucherCreationAttributes>>) {
    try {
      const { id } = req.params;
      const voucher = await this.voucherService.updateById(Number(id), req.body);
      res.status(HttpStatusCode.Ok).send({
        statusCode: HttpStatusCode.Ok,
        message: 'Voucher has been Updated successfully',
        data: voucher!,
      });
    } catch (e) {
      ProcessError(e, res);
    }
  }

  async delete(req: Request, res: Response<IResponse<VoucherCreationAttributes>>) {
    try {
      const { id } = req.params;
      await this.voucherService.delete(Number(id));
      res.status(HttpStatusCode.Ok).send({
        statusCode: HttpStatusCode.Ok,
        message: 'Voucher has been Deleted successfully',
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
      const vouchers = await this.voucherService.page(page, limit, sortBy, filterBy, key);

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
