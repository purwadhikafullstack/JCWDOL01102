import { Router } from 'express';
import UserRoute from './user/user.route';
import { UserController } from '../controllers/user';

export default class MainRouter {
  router: Router;
  userRoute: UserRoute;

  constructor() {
    // Initialize router object
    this.router = Router();
    this.userRoute = new UserRoute();
    this.serve();
  }

  private serve() {
    this.router.get('/', (req, res) => {
      res.json({
        message: 'Welcome to the API',
      });
    });

    //   this.router
    //     .route('/users/:id')
    //     .get((req: Request, res: Response) => this.userController.read(req, res))
    //     .put((req: Request, res: Response) => this.userController.update(req, res))
    //     .delete((req: Request, res: Response) => this.userController.delete(req, res));

    //   this.router
    //     .route('/users')
    //     .get((req: Request, res: Response) => this.userController.paginate(req, res))
    //     .post((req: Request, res: Response) => this.userController.create(req, res));
  }
}
