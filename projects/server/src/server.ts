/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import express, { NextFunction, Response } from 'express';
import expressListEndpoints from 'express-list-endpoints';
import helmet from 'helmet';
import { messages } from './config/message';
import { Routes } from './routeSetup';

const Reset = '\x1b[0m';
// const FgRed = '\x1b[31m';
const FgGreen = '\x1b[32m';
const FgYellow = '\x1b[33m';

export default class Server {
  expressInstance: express.Express;

  routes: Routes;

  constructor() {
    this.expressInstance = express();
    this.middlewareSetup();
    this.routes = new Routes(this.expressInstance);
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
    this.routes.routesSetup(this.expressInstance);
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
