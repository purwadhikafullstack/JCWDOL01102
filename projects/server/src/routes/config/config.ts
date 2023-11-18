import { Router } from 'express';
import { ConfigController } from '../../controllers/config/config.controller';
import { createConfigValidator } from '../../helper/validator/config/config.validator';

export default class ConfigRouter {
  router: Router;
  configController: ConfigController;

  constructor() {
    this.configController = new ConfigController();
    this.router = Router({ mergeParams: true });
    this.configRoutes();
  }

  private configRoutes() {
    this.router.route('/').get((req, res) => this.configController.getConfig(req, res));
    this.router.route('/').post(createConfigValidator(), (req, res) => this.configController.createConfig(req, res));
  }
}
