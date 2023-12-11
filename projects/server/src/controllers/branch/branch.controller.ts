import { Request, Response } from 'express';
import BranchService from '../../service/branch/branch.service';
import { ProcessError } from '../../helper/Error/errorHandler';
import { IResponse } from '../interface';
import { BranchAttributes } from '../../database/models/branch.model';
import { HttpStatusCode } from 'axios';

export default class BranchController {
  private branchService: BranchService;

  constructor() {
    this.branchService = new BranchService();
  }

  async getAllBranch(req: Request, res: Response<IResponse<BranchAttributes>>) {
    try {
      const branches = await this.branchService.getAllBranch();
      res.status(HttpStatusCode.Ok).send({
        statusCode: HttpStatusCode.Ok,
        message: 'Get all branches success',
        data: branches,
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }
}
