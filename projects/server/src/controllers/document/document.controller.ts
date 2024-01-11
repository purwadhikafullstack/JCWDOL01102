import { Request, Response } from 'express';
import DocumentService from '../../service/documents/documents.service';
import { ProcessError } from '../../helper/Error/errorHandler';
import { IResponse } from '../interface';
import { DocumentAttributes } from '../../database/models/document.model';
import { HttpStatusCode } from 'axios';

export default class DocumentController {
  private documentService: DocumentService;
  constructor() {
    this.documentService = new DocumentService();
  }

  async createDocument(req: Request, res: Response<IResponse<DocumentAttributes>>) {
    try {
      const document = await this.documentService.createDocument(req.body);
    } catch (e) {
      ProcessError(e, res);
    }
  }

  async uploadDocument(req: Request, res: Response<IResponse<DocumentAttributes>>) {
    try {
      const file = req.file as Express.Multer.File;
      const type = req.body.type;
      const document = await this.documentService.uploadDocument(file, type);
      res.status(HttpStatusCode.Ok).json({
        statusCode: HttpStatusCode.Ok,
        message: 'Success',
        data: document,
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }

  async getDocument(req: Request, res: Response<any>) {
    try {
      const result = await this.documentService.getFileById(req.params.id);
      res.setHeader('Content-Type', result.mime.mime);
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      res.status(HttpStatusCode.Ok);
      res.send(result.objectData);
    } catch (error) {
      ProcessError(error, res);
    }
  }
}
