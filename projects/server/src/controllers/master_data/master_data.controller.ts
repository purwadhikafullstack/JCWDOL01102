import { Request, Response } from 'express';
import { ProcessError } from '../../helper/Error/errorHandler';
import { MasterDataService } from '../../service/master-data/master-data.service';
import { HttpStatusCode } from 'axios';
import { IResponse } from '../interface';
import { messages } from '../../config/message';

export class MasterDataController {
  masterDataService: MasterDataService;

  constructor() {
    this.masterDataService = new MasterDataService();
  }

  async getAllProvinces(req: Request, res: Response<IResponse<any>>) {
    try {
      const provinces = await this.masterDataService.getAllProvinces();
      res.status(HttpStatusCode.Ok).send({
        statusCode: HttpStatusCode.Ok,
        message: messages.SUCCESS,
        data: provinces,
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }

  async getAllDistricts(req: Request, res: Response<IResponse<any>>) {
    try {
      const province_id = req.query.province_id ? Number(req.query.province_id) : undefined;
      const districts = await this.masterDataService.getAllCities(province_id);
      res.status(HttpStatusCode.Ok).send({
        statusCode: HttpStatusCode.Ok,
        message: messages.SUCCESS,
        data: districts,
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }
}
