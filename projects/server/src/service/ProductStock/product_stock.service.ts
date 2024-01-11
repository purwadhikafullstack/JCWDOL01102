import { Transaction } from 'sequelize';
import { productConstants } from '../../config/productConstants';
import StockHistory from '../../database/models/stock_histories';
import { IUpdateStock } from './interface/interface';

export class ProductStockService {
  async updateProductStock(
    input: IUpdateStock,
    note?: { description?: string; t?: Transaction }
  ): Promise<StockHistory> {
    try {
      const productStock = await StockHistory.create(
        {
          currentStock: input.currentStock,
          lastStock: input.lastStock,
          productId: input.productId,
          type:
            input.currentStock < input.lastStock
              ? productConstants.UPDATE_STOCK.DECREASE
              : productConstants.UPDATE_STOCK.INCREASE,
          shippingPrice: 0,
          description: note?.description ?? productConstants.UPDATE_STOCK.DESCRIPTION,
          updatedStock: Math.abs(input.currentStock - input.lastStock),
          branchId: input.branchId,
          userId: input.userId,
        },
        {
          transaction: note?.t ?? undefined,
        }
      );
      return productStock;
    } catch (error) {
      throw error;
    }
  }
}
