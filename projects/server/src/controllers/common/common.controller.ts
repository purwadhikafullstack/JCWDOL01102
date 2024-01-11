import { Request, Response } from 'express';
import { OpenCageService } from '../../service/openCage/open.cage.service';
import { ProcessError } from '../../helper/Error/errorHandler';
import { HttpStatusCode } from 'axios';
import { messages } from '../../config/message';
import { IResponse } from '../interface';
import { PaymentGatewayService } from '../../service/paymentGateway/paymentGateway.service';
import PaymentGateway from '../../database/models/paymentGateway.mode';
import { RajaOngkirResponse } from '../../service/rajaOngkir/interface';
import { RajaOngkirService } from '../../service/rajaOngkir/rajaOngkir.service';

export class CommonController {
  openCageService: OpenCageService;
  paymentGatewayService: PaymentGatewayService;
  rajaOngkirService: RajaOngkirService;

  constructor() {
    this.openCageService = new OpenCageService();
    this.paymentGatewayService = new PaymentGatewayService();
    this.rajaOngkirService = new RajaOngkirService();
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

  async getAllPaymentGateway(req: Request, res: Response<IResponse<PaymentGateway[]>>) {
    try {
      const result = await this.paymentGatewayService.getAll();
      res.status(HttpStatusCode.Ok).json({
        statusCode: HttpStatusCode.Ok,
        message: messages.SUCCESS,
        data: result,
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }

  async getCourierPrice(req: Request, res: Response<IResponse<RajaOngkirResponse>>) {
    try {
      const result = await this.rajaOngkirService.checkOngkir(req.body);
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
