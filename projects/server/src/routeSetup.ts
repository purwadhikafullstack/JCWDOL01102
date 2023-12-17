import express from 'express';
import AuthMiddleware from './middleware/auth.middleware';
import { AddressRouter } from './routes/address/address.route';
import { BranchRoute } from './routes/branch/branch.route';
import { CategoryRouter } from './routes/category/category.route';
import { CommonRouter } from './routes/common/common.route';
import ConfigRouter from './routes/config/config';
import DocuementRouter from './routes/document/document.route';
import { MasterDataRouter } from './routes/master_data/master_data.route';
import ProductRouter from './routes/product/product.route';
import PromotionRouter from './routes/promotion/promotion.route';
import userRouter from './routes/user/user.route';
import VoucherRouter from './routes/voucher/voucher.route';
import MainRouter from './routes';

export class Routes {
  configRouter: express.Router;
  router: express.Router;
  userRouter: express.Router;
  addressRouter: express.Router;
  masterDataRouter: express.Router;
  documentRouter: express.Router;
  productRouter: express.Router;
  authMiddleware: AuthMiddleware;
  categoryRouter: express.Router;
  branchRouter: express.Router;
  voucherRouter: express.Router;
  promotionRouter: express.Router;
  commonRouter: express.Router;

  constructor(expressInstance: express.Express) {
    this.router = new MainRouter().router;
    this.userRouter = new userRouter().router;
    this.addressRouter = new AddressRouter().router;
    this.masterDataRouter = new MasterDataRouter().router;
    this.documentRouter = new DocuementRouter().router;
    this.productRouter = new ProductRouter().router;
    this.authMiddleware = new AuthMiddleware();
    this.categoryRouter = new CategoryRouter().router;
    this.branchRouter = new BranchRoute().route;
    this.voucherRouter = new VoucherRouter().router;
    this.promotionRouter = new PromotionRouter().router;
    this.commonRouter = new CommonRouter().router;
    this.configRouter = new ConfigRouter().router;
    this.routesSetup(expressInstance);
  }

  routesSetup(expressInstance: express.Express) {
    expressInstance.use(this.authMiddleware.checkAuth);
    expressInstance.use('/', this.router);
    expressInstance.use('/api/config', this.configRouter);
    expressInstance.use('/api/users', this.userRouter);
    expressInstance.use('/api/address', this.addressRouter);
    expressInstance.use('/api/master-data', this.masterDataRouter);
    expressInstance.use('/api/document', this.documentRouter);
    expressInstance.use('/api/product', this.productRouter);
    expressInstance.use('/api/category', this.categoryRouter);
    expressInstance.use('/api/branches', this.branchRouter);
    expressInstance.use('/api/vouchers', this.voucherRouter);
    expressInstance.use('/api/promotions', this.promotionRouter);
    expressInstance.use('/api/common', this.commonRouter);
  }
}
