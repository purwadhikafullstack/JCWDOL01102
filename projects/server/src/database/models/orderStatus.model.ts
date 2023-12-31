import { DataTypes, Optional } from 'sequelize';
import BaseModel, { BaseModelAttributes, baseModelInit, baseModelConfig } from './base.model';
import Order from './order.model';

export interface OrderStatusAttributes extends BaseModelAttributes {
  orderId: number;
  status: string;
}

export interface OrderStatusCreationAttributes extends Optional<OrderStatusAttributes, 'id'> {}

export default class OrderStatus
  extends BaseModel<OrderStatusAttributes, OrderStatusCreationAttributes>
  implements OrderStatusAttributes
{
  public orderId!: number;
  public status!: string;
}

OrderStatus.init(
  {
    ...baseModelInit,
    orderId: {
      type: new DataTypes.INTEGER(),
      allowNull: false,
    },
    status: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    ...baseModelConfig,
    tableName: 'order_status',
  }
);

OrderStatus.belongsTo(Order, {
  as: 'order',
  foreignKey: 'order_id',
  targetKey: 'id',
});
