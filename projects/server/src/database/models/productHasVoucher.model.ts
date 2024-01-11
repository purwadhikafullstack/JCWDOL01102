import { DataTypes, Optional } from 'sequelize';
import BaseModel, { BaseModelAttributes, baseModelInit, baseModelConfig } from './base.model';

interface ProductHasVoucherAttributes extends BaseModelAttributes {
  productId: number;
  voucherId: number;
}

export interface ProductHasVoucherCreationAttributes extends Optional<ProductHasVoucherAttributes, 'id'> {}
export interface ProductHasVoucherUpdateAttributes extends Partial<ProductHasVoucherAttributes> {}

export default class ProductHasVouchers
  extends BaseModel<ProductHasVoucherAttributes, ProductHasVoucherCreationAttributes>
  implements ProductHasVoucherAttributes
{
  public id!: number;
  public productId!: number;
  public voucherId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

ProductHasVouchers.init(
  {
    ...baseModelInit,
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    voucherId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { ...baseModelConfig, tableName: 'product_has_vouchers' }
);
