import { Request, Response } from 'express';
import { OpenCageService } from '../../service/openCage/open.cage.service';
import { ProcessError } from '../../helper/Error/errorHandler';
import { HttpStatusCode } from 'axios';
import { messages } from '../../config/message';
import { IResponse } from '../interface';

export class CommonController {
  openCageService: OpenCageService;
  constructor() {
    this.openCageService = new OpenCageService();
  }

  async forwardGeocode(req: Request, res: Response<IResponse<any>>) {
    try {
      const { query } = req.body;
      const result = await this.openCageService.forwardGeocode(query);
      res.status(HttpStatusCode.Ok).json({
        statusCode: HttpStatusCode.Ok,
        message: messages.SUCCESS,
        data: result,
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }
}
