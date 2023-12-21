import { Router } from 'express';
import { AddressController } from '../../controllers/address/address.controller';
import { createAddressValidator, updateAddressValidator } from '../../helper/validator/address/address.validator';
import { permissionsMiddleware } from '../../middleware/permissions.middleware';

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
      .post(permissionsMiddleware(['can_create_address']), createAddressValidator(), (req, res) =>
        this.addressController.createAddress(req, res)
      );
    this.router
      .route('/:id')
      .get(permissionsMiddleware(['can_read_address']), (req, res) => this.addressController.getAddressList(req, res));
    this.router
      .route('/:id/:addressId')
      .put(permissionsMiddleware(['can_update_address']), (req, res) =>
        this.addressController.changeDefaultAddress(req, res)
      );
    this.router
      .route('/:id/:addressId')
      .patch(permissionsMiddleware(['can_update_address']), updateAddressValidator(), (req, res) =>
        this.addressController.updateAddress(req, res)
      );
    this.router
      .route('/:id/:addressId')
      .get(permissionsMiddleware(['can_read_address']), (req, res) => this.addressController.getAddressById(req, res));
  }
}
