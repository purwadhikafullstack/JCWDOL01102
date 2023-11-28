/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import bodyParser from 'body-parser';
import compression from 'compression';
import express, { NextFunction, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import MainRouter from './routes';
import expressListEndpoints from 'express-list-endpoints';
import ConfigRouter from './routes/config/config';
import { messages } from './config/message';
import UserRouter from './routes/user/user.route';
import { AddressRouter } from './routes/address/address.route';
import { MasterDataRouter } from './routes/master_data/master_data.route';
import DocuementRouter from './routes/document/document.route';
import { ProductRouter } from './routes/product/product.route';

const Reset = '\x1b[0m';
// const FgRed = '\x1b[31m';
const FgGreen = '\x1b[32m';
const FgYellow = '\x1b[33m';

export default class Server {
  expressInstance: express.Express;

  constructor() {
    this.expressInstance = express();
    this.middlewareSetup();
    this.routesSetup();
    this.printRegisteredRoutes();
  }

  private middlewareSetup() {
    // Setup common security protection (Helmet should come first)
    this.expressInstance.use(helmet());

    // Setup Cross Origin access (CORS can be configured as needed)
    this.expressInstance.use(cors());

    // Setup requests format parsing (BodyParser should come before other routes)
    this.expressInstance.use(bodyParser.urlencoded({ extended: true }));
    this.expressInstance.use(bodyParser.json());

    // Setup requests gZip compression (Should be the last middleware)
    this.expressInstance.use(compression());
  }

  private routesSetup() {
    // Instantiate mainRouter object
    const router = new MainRouter().router;
    const configRouter = new ConfigRouter().router;
    const userRouter = new UserRouter().router;
    const addressRouter = new AddressRouter().router;
    const masterDataRouter = new MasterDataRouter().router;
    const documentRouter = new DocuementRouter().router;
    const productRouter = new ProductRouter().router;

    // Add to server routes the mainRouter, the api routes should be added before the 404 route
    // The first api name should be "/api" , e.g. /api/users
    this.expressInstance.use('/', router);
    this.expressInstance.use('/api/config', configRouter);
    this.expressInstance.use('/api/users', userRouter);
    this.expressInstance.use('/api/address', addressRouter);
    this.expressInstance.use('/api/master-data', masterDataRouter);
    this.expressInstance.use('/api/document', documentRouter);
    this.expressInstance.use('/api/product', productRouter);

    // Register 404 route , this should be the last route
    // @ts-ignore
    this.expressInstance.use((_req: Request, res: Response, _next: NextFunction) => {
      res.status(404).send({
        statusCode: 404,
        message: messages.API_NOT_FOUND,
      });
    });
  }
  private printRegisteredRoutes() {
    console.log(`\n`);

    function printLog(method: string, path: string) {
      console.log(`${FgYellow}Registered route: ${FgGreen}${method} ${path}` + Reset);
    }
    const routes = expressListEndpoints(this.expressInstance);
    routes.forEach((route: any) => {
      if (route.methods.length > 1) {
        route.methods.forEach((method: string) => {
          printLog(method, route.path);
        });
      } else {
        printLog(route.methods[0], route.path);
      }
    });
  }
}
