import { Request, Response } from 'express';
import DocumentService from '../../service/documents/documents.service';
import { ProcessError } from '../../helper/Error/errorHandler';
import { IResponse } from '../interface';
import { DocumentAttributes } from '../../database/models/document.model';

export default class DocumentController {
  private documentService: DocumentService;
  constructor() {
    this.documentService = new DocumentService();
  }

  async createDocument(req: Request, res: Response<IResponse<DocumentAttributes>>) {
    try {
      const document = await this.documentService.createDocument(req.body);
      console.log(document);
    } catch (e) {
      ProcessError(e, res);
    }
  }
}
