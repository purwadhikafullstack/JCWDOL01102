import { Request, Response } from 'express';
import ConfigServie from '../../service/config/config.service';
import { ProcessError } from '../../helper/Error/errorHandler';
import { IResponse } from '../interface';
import { ConfigAttributes } from '../../database/models/configs.model';
import { HttpStatusCode } from 'axios';
import { messages } from '../../config/message';

export class ConfigController {
  configService: ConfigServie;

  constructor() {
    this.configService = new ConfigServie();
  }

  async getConfig(req: Request, res: Response<IResponse<ConfigAttributes>>): Promise<void> {
    try {
      const { module, name } = req.query;
      const result = await this.configService.getConfig(<string>module, <string>name);
      res.status(HttpStatusCode.Ok).send({
        statusCode: HttpStatusCode.Ok,
        message: messages.SUCCESS,
        data: result ?? {},
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }

  async createConfig(req: Request, res: Response<IResponse<ConfigAttributes>>): Promise<void> {
    try {
      const { module, name, data } = req.body;
      const result = await this.configService.createConfig({ module, name, data });

      res.status(HttpStatusCode.Ok).send({
        statusCode: HttpStatusCode.Ok,
        message: messages.SUCCESS,
        data: result ?? {},
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }

  async deleteConfigById(req: Request, res: Response<IResponse<any>>): Promise<void> {
    try {
      const { id } = req.params;
      await this.configService.deleteConfigById(parseInt(id));
      res.status(HttpStatusCode.Ok).send({
        statusCode: HttpStatusCode.Ok,
        message: messages.SUCCESS,
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }

  async deleteConfig(req: Request, res: Response<IResponse<any>>): Promise<void> {
    try {
      const { module, name } = req.query;
      await this.configService.deleteConfig({
        module: <string>module,
        name: <string>name,
      });
      res.status(HttpStatusCode.Ok).send({
        statusCode: HttpStatusCode.Ok,
        message: messages.SUCCESS,
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }
}
