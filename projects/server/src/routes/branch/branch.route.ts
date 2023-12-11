import { Request, Response, Router } from 'express';
import BranchController from '../../controllers/branch/branch.controller';

export class BranchRoute {
  route: Router;
  private branchController: BranchController;

  constructor() {
    this.route = Router();
    this.branchController = new BranchController();
    this.routes();
  }

  private routes() {
    this.route.get('/', (req: Request, res: Response) => this.branchController.getAllBranch(req, res));
  }
}
