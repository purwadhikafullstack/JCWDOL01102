import { Request, Response } from 'express';
import DokuService from '../../service/doku/doku.service';

export class ExternalController {
  dokuService: DokuService;

  constructor() {
    this.dokuService = new DokuService();
  }

  async paymentNotification(req: Request, res: Response) {
    try {
      console.log('[NOTIF_HEADERS]', JSON.stringify(req.headers));
      console.log('[NOTIF_BODY]', JSON.stringify(req.body));
      await this.dokuService.handlePaymentNotification(req.headers, req.body);
      res.status(200).json({
        status: 200,
        message: 'Success',
      });
    } catch (error: any) {
      res.status(500).json({
        status: 500,
        message: error.message,
        data: error,
      });
    }
  }
}
