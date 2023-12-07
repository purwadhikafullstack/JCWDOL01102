import { Request, Response, Router } from 'express';
import DocumentController from '../../controllers/document/document.controller';
import { multerMiddleware } from '../../middleware/image.multer.middleware';

export default class DocuementRouter {
  router: Router;
  documentController: DocumentController;
  constructor() {
    this.router = Router();
    this.documentController = new DocumentController();
    this.routes();
  }

  private routes() {
    this.router.post('/upload', multerMiddleware, (req: Request, res: Response) =>
      this.documentController.uploadDocument(req, res)
    );
    this.router.get('/:id', (req: Request, res: Response) => this.documentController.getDocument(req, res));
  }
}
