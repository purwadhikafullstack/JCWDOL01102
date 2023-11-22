import { Router } from 'express';
import { MasterDataController } from '../../controllers/master_data/master_data.controller';

export class MasterDataRouter {
  router: Router;
  masterDataController: MasterDataController;

  constructor() {
    this.router = Router({ mergeParams: true });
    this.masterDataController = new MasterDataController();
    this.masterDataRoutes();
  }

  private masterDataRoutes() {
    this.router.route('/provinces').get((req, res) => this.masterDataController.getAllProvinces(req, res));
  }
}
