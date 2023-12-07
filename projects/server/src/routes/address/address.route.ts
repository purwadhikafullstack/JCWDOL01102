import { Router } from 'express';
import { AddressController } from '../../controllers/address/address.controller';
import { createAddressValidator, updateAddressValidator } from '../../helper/validator/address/address.validator';

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
    this.router.route('/:id').get((req, res) => this.addressController.getAddressList(req, res));
    this.router.route('/:id/:addressId').put((req, res) => this.addressController.changeDefaultAddress(req, res));
    this.router
      .route('/:id/:addressId')
      .patch(updateAddressValidator(), (req, res) => this.addressController.updateAddress(req, res));
    this.router.route('/:id/:addressId').get((req, res) => this.addressController.getAddressById(req, res));
  }
}
