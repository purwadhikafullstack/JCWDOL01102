import { DataTypes, Optional } from 'sequelize';
import BaseModel, { BaseModelAttributes, baseModelInit, baseModelConfig } from './base.model';

export interface OrderAttributes extends BaseModelAttributes {
  userId: number;
  voucherId?: number;
  paymentId: number;
  total: number;
  status: string;
  promotionId?: number;
  branchId: number;
  invoiceNo: string;
}

export interface OrderCreationAttributes extends Optional<OrderAttributes, 'id'> {}

export default class Order extends BaseModel<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
  public userId!: number;
  public total!: number;
  public status!: string;
  public voucherId!: number;
  public paymentId!: number;
  public promotionId!: number;
  public branchId!: number;
  public invoiceNo!: string;
}

Order.init(
  {
    ...baseModelInit,
    userId: {
      type: new DataTypes.INTEGER(),
      allowNull: false,
    },
    voucherId: {
      type: new DataTypes.INTEGER(),
      allowNull: true,
    },
    paymentId: {
      type: new DataTypes.INTEGER(),
      allowNull: true,
    },
    total: {
      type: new DataTypes.INTEGER(),
      allowNull: false,
    },
    status: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    promotionId: {
      type: new DataTypes.INTEGER(),
      allowNull: true,
    },
    branchId: {
      type: new DataTypes.INTEGER(),
      allowNull: true,
    },
    invoiceNo: {
      type: new DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    ...baseModelConfig,
    tableName: 'orders',
  }
);
