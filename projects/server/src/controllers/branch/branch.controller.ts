import { NextFunction, Request, Response } from 'express';
import BranchService from '../../service/branch/branch.service';
import { ProcessError } from '../../helper/Error/errorHandler';
import { IResponse } from '../interface';
import { BranchAttributes } from '../../database/models/branch.model';
import { HttpStatusCode } from 'axios';
import { IBranchWithDistanceAttributes } from '../../service/branch/interface';

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

  async getNearestBranch(req: Request, res: Response<IResponse<IBranchWithDistanceAttributes>>, next: NextFunction) {
    try {
      if (!req.query.latitude && !req.query.longitude) {
        return next();
      }
      const { latitude, longitude } = req.query;
      const branches = await this.branchService.getNearestBranch({
        latitude: Number(latitude),
        longitude: Number(longitude),
      });
      res.status(HttpStatusCode.Ok).send({
        statusCode: HttpStatusCode.Ok,
        message: 'Get nearest branch success',
        data: branches,
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }

  async getBranchByUserId(req: Request, res: Response<IResponse<BranchAttributes>>) {
    try {
      const { userId } = req.user;
      const branch = await this.branchService.getBranchByUserId(userId);
      res.status(HttpStatusCode.Ok).send({
        statusCode: HttpStatusCode.Ok,
        message: 'Get branch success',
        data: branch,
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }
}
