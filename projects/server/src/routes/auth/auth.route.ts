import { Router, Request, Response } from 'express';
import AuthController from '../../controllers/auth/auth.controller';
import {
  createLoginValidator,
  createSendEmailValidation,
  createVerifyValidator,
} from '../../helper/validator/user/user.validator';

export default class AuthRoute {
  router: Router;
  private authController: AuthController;

  constructor() {
    this.router = Router();
    this.authController = new AuthController();
    this.serve();
  }

  serve() {
    this.router
      .route('/email')
      .get(createSendEmailValidation(), (req: Request, res: Response) => this.authController.sendEmail(req, res));
    this.router
      .route('/login')
      .post(createLoginValidator(), (req: Request, res: Response) => this.authController.Login(req, res));
    this.router
      .route('/verify')
      .patch(createVerifyValidator(), (req: Request, res: Response) => this.authController.verify(req, res));
  }
}
