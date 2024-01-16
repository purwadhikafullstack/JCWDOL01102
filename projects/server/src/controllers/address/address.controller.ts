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

  async getAddressList(req: Request, res: Response<IResponse<Addresses[]>>): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.addressService.getAddressList(parseInt(id));

      res.status(HttpStatusCode.Ok).send({
        statusCode: HttpStatusCode.Ok,
        message: messages.SUCCESS,
        data: result,
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }

  async changeDefaultAddress(req: Request, res: Response<IResponse<Addresses>>): Promise<void> {
    try {
      const { id, addressId } = req.params;
      const result = await this.addressService.changeDefaultAddress(parseInt(id), parseInt(addressId));

      res.status(HttpStatusCode.Ok).send({
        statusCode: HttpStatusCode.Ok,
        message: messages.SUCCESS,
        data: result,
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }

  async updateAddress(req: Request, res: Response<IResponse<Addresses>>): Promise<void> {
    try {
      const { id, addressId } = req.params;
      const input = req.body;
      const result = await this.addressService.updateAddress(parseInt(id), parseInt(addressId), input);

      res.status(HttpStatusCode.Ok).send({
        statusCode: HttpStatusCode.Ok,
        message: messages.SUCCESS,
        data: result,
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }

  async getAddressById(req: Request, res: Response<IResponse<Addresses>>): Promise<void> {
    try {
      const { id, addressId } = req.params;
      const result = await this.addressService.getAddressById(parseInt(id), parseInt(addressId));

      res.status(HttpStatusCode.Ok).send({
        statusCode: HttpStatusCode.Ok,
        message: messages.SUCCESS,
        data: result,
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }
}
