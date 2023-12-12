// 1	id	int	NULL	NULL	NO	NULL	auto_increment
// 2	last_stock	int	NULL	NULL	NO	NULL
// 3	updated_stock	int	NULL	NULL	NO	NULL
// 4	shipping_price	int	NULL	NULL	NO	NULL
// 5	current_stock	int	NULL	NULL	NO	NULL
// 6	type	varchar(255)	utf8mb4	utf8mb4_0900_ai_ci	NO	NULL
// 7	description	varchar(255)	utf8mb4	utf8mb4_0900_ai_ci	NO	NULL
// 8	created_at	datetime	NULL	NULL	NO	CURRENT_TIMESTAMP	DEFAULT_GENERATED
// 9	updated_at	datetime	NULL	NULL	YES	CURRENT_TIMESTAMP	DEFAULT_GENERATED on update CURRENT_TIMESTAMP

import { DataTypes, Optional } from 'sequelize';
import BaseModel, { BaseModelAttributes, baseModelConfig, baseModelInit } from './base.model';

// StockHistory Interface
export interface StockHistoryAttributes extends BaseModelAttributes {
  lastStock: number;
  updatedStock: number;
  shippingPrice: number;
  currentStock: number;
  type: string;
  description: string;
  productId: number;
  branchId: number;
  userId: number;
}

export interface StockHistoryCreationAttributes extends Optional<StockHistoryAttributes, 'id'> {}

// Sequelize Model

class StockHistory
  extends BaseModel<StockHistoryAttributes, StockHistoryCreationAttributes>
  implements StockHistoryAttributes
{
  public lastStock!: number;
  public updatedStock!: number;
  public shippingPrice!: number;
  public currentStock!: number;
  public type!: string;
  public description!: string;
  public productId!: number;
  public branchId!: number;
  public userId!: number;
}

StockHistory.init(
  {
    ...baseModelInit,
    lastStock: {
      type: DataTypes.INTEGER(),
      allowNull: false,
    },
    updatedStock: {
      type: DataTypes.INTEGER(),
      allowNull: false,
    },
    shippingPrice: {
      type: DataTypes.INTEGER(),
      allowNull: false,
    },
    currentStock: {
      type: DataTypes.INTEGER(),
      allowNull: false,
    },
    type: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER(),
      allowNull: false,
    },
    branchId: {
      type: DataTypes.INTEGER(),
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER(),
      allowNull: false,
    },
  },
  {
    ...baseModelConfig,
    tableName: 'stock_histories',
  }
);

export default StockHistory;
