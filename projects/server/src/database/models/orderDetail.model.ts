import { DataTypes, Optional } from 'sequelize';
import BaseModel, { BaseModelAttributes, baseModelInit, baseModelConfig } from './base.model';
import Order from './order.model';

export interface OrderDetailAttributes extends BaseModelAttributes {
  orderId: number;
  productId: number;
  qty: number;
  price: number;
}

export interface OrderDetailCreationAttributes extends Optional<OrderDetailAttributes, 'id'> {}

export default class OrderDetail
  extends BaseModel<OrderDetailAttributes, OrderDetailCreationAttributes>
  implements OrderDetailAttributes
{
  public orderId!: number;
  public productId!: number;
  public qty!: number;
  public price!: number;
}

OrderDetail.init(
  {
    ...baseModelInit,
    orderId: {
      type: new DataTypes.INTEGER(),
      allowNull: false,
    },
    productId: {
      type: new DataTypes.INTEGER(),
      allowNull: false,
    },
    qty: {
      type: new DataTypes.INTEGER(),
      allowNull: false,
    },
    price: {
      type: new DataTypes.INTEGER(),
      allowNull: false,
    },
  },
  {
    ...baseModelConfig,
    tableName: 'order_details',
  }
);

OrderDetail.belongsTo(Order, {
  as: 'order',
  foreignKey: 'order_id',
  targetKey: 'id',
});
