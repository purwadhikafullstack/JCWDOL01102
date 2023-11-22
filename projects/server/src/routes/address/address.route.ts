import { Router } from 'express';
import { AddressController } from '../../controllers/address/address.controller';
import { createAddressValidator } from '../../helper/validator/address/address.validator';

export class AddressRouter {
  router: Router;
  addressController: AddressController;

  constructor() {
    this.router = Router();
    this.addressController = new AddressController();
    this.addressRoutes();
  }

  private addressRoutes() {
    this.router
      .route('/:id')
      .post(createAddressValidator(), (req, res) => this.addressController.createAddress(req, res));
  }
}
