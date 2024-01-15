import { Request, Response } from 'express';
import CartService from '../../service/cart/cart.service';
import { IResponse } from '../interface';
import { ProcessError } from '../../helper/Error/errorHandler';
import { CartCreationAttributes } from '../../database/models/cart.model';
import { HttpStatusCode } from 'axios';
import { messages } from '../../config/message';

export default class CartController {
  cartService: CartService;

  constructor() {
    this.cartService = new CartService();
  }
  async findCart(req: Request, res: Response<IResponse<any>>) {
    try {
      const { branchId, userId } = req.query;
      const cartDetails = await this.cartService.findCartItems(Number(branchId), Number(userId));
      res.status(HttpStatusCode.Ok).json({
        statusCode: HttpStatusCode.Ok,
        message: messages.SUCCESS,
        data: cartDetails,
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }
  async manageCart(req: Request, res: Response<IResponse<any>>) {
    try {
      const input = req.body as CartCreationAttributes;
      const action: string = String(req.query.action);
      const { branchId, userId, productId } = req.query;
      let cart;
      if (action === 'add') {
        cart = await this.cartService.addItem(Number(branchId), Number(userId), Number(productId), input);
      } else if (action === 'reduce') {
        cart = await this.cartService.reduceItem(Number(branchId), Number(userId), Number(productId), input);
      }
      res.status(HttpStatusCode.Ok).json({
        statusCode: HttpStatusCode.Ok,
        message: messages.SUCCESS,
        data: cart,
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }

  async clearCart(req: Request, res: Response<IResponse<any>>) {
    try {
      await this.cartService.deleteAllItem(req.body);
      res.status(HttpStatusCode.Ok).json({
        statusCode: HttpStatusCode.Ok,
        message: messages.SUCCESS,
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }

  async clearCartBranch(req: Request, res: Response<IResponse<any>>) {
    try {
      const { userId } = req.user;
      await this.cartService.deleteAllItemByBranch(userId);
      res.status(HttpStatusCode.Ok).json({
        statusCode: HttpStatusCode.Ok,
        message: messages.SUCCESS,
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }
}
