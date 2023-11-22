import { Request, Response } from 'express';
import { AddressService } from '../../service/address/address.service';
import { IResponse } from '../interface';
import Addresses from '../../database/models/address.model';
import { ProcessError } from '../../helper/Error/errorHandler';
import { HttpStatusCode } from 'axios';
import { messages } from '../../config/message';

export class AddressController {
  addressService: AddressService;

  constructor() {
    this.addressService = new AddressService();
  }

  async createAddress(req: Request, res: Response<IResponse<Addresses>>): Promise<void> {
    try {
      const { id } = req.params;
      const input = req.body;
      const result = await this.addressService.createAddress(parseInt(id), input);

      res.status(HttpStatusCode.Created).send({
        statusCode: HttpStatusCode.Created,
        message: messages.CREATED,
        data: result,
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }
}
