import { CartAttributes } from '../../../database/models/cart.model';
import { IProduct } from '../../products/interface/interfaces';

export interface ICartProduct extends CartAttributes {
  product: IProduct;
}
