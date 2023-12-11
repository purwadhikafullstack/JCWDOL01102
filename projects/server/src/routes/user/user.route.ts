import { NextFunction, Request, Response, Router } from 'express';
import { UserController } from '../../controllers/user/user.controller';
import {
  createLoginValidator,
  createSendEmailValidation,
  createUserGetValidation,
  createUserValidation,
  createVerifyValidator,
  userExistValidation,
} from '../../helper/validator/user/user.validator';

export default class userRouter {
  router: Router;
  private userController: UserController;
  constructor() {
    this.router = Router({ mergeParams: true });
    this.userController = new UserController();
    this.serve();
  }

  serve() {
    this.router
      .route('')
      .post(createUserValidation(), userExistValidation(), (req: Request, res: Response) =>
        this.userController.create(req, res)
      )
      .get(
        createUserGetValidation(),
        (req: Request, res: Response, next: NextFunction) => {
          this.userController.findUserByEmail(req, res, next);
        },
        (req: Request, res: Response, next: NextFunction) => {
          this.userController.findUserByRoleId(req, res, next);
        },
        (req: Request, res: Response) => {
          this.userController.page(req, res);
        }
      );

    this.router
      .route('/email')
      .get(createSendEmailValidation(), (req: Request, res: Response) => this.userController.sendEmail(req, res));
    this.router
      .route('/login')
      .post(createLoginValidator(), (req: Request, res: Response) => this.userController.Login(req, res));
    this.router
      .route('/verify')
      .patch(createVerifyValidator(), (req: Request, res: Response) => this.userController.verify(req, res));
    this.router.route('/:id').get((req: Request, res: Response) => this.userController.read(req, res));
    this.router.route('/:id').put((req: Request, res: Response) => this.userController.updateById(req, res));
    this.router.route('/:id').delete((req: Request, res: Response) => this.userController.delete(req, res));
  }
}
