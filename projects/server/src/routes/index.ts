import { Router } from 'express';
import UserRoute from './user/user.route';

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
  }
}
