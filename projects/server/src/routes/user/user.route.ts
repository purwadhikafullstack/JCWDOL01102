import { Request, Response, Router } from 'express';
import { UserController } from '../../controllers/user/user.controller';
import { AuthMiddleware } from '../../middleware/auth.middleware';
import { userCreationValidations, userEmailQueryValidation } from '../../helper/validator/user/user.validator';

export default class userRouter {
  router: Router;
  private userController: UserController;
  constructor() {
    this.router = Router({ mergeParams: true });
    this.userController = new UserController();
    this.serve();
  }

  serve() {
    this.router.route('/:id').get((req: Request, res: Response) => this.userController.read(req, res));

    this.router
      .route('/')
      .post(AuthMiddleware.InputValidator(userCreationValidations), (req: Request, res: Response) =>
        this.userController.create(req, res)
      )
      .get(AuthMiddleware.InputValidator(userEmailQueryValidation), (req: Request, res: Response) => {
        this.userController.findUserByEmail(req, res);
      });
  }
}
