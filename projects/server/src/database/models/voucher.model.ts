import { DataTypes, Optional } from 'sequelize';
import BaseModel, { BaseModelAttributes, baseModelInit, baseModelConfig } from './base.model';
import Product from './products.model';
import ProductHasVouchers from './productHasVoucher.model';
import { BelongsToManyAddAssociationMixin, BelongsToManyRemoveAssociationMixin } from 'sequelize';

interface VoucherAttributes extends BaseModelAttributes {
  name: string;
  type: string;
  dateStart: Date;
  dateEnd: Date;
  value: number;
  valueType: string;
  minimumPrice: number;
}

export interface VoucherCreationAttributes extends Optional<VoucherAttributes, 'id'> {}
export interface VoucherUpdateAttributes extends Partial<VoucherAttributes> {}

export default class Vouchers
  extends BaseModel<VoucherAttributes, VoucherCreationAttributes>
  implements VoucherAttributes
{
  public id!: number;
  public name!: string;
  public type!: string;
  public dateStart!: Date;
  public dateEnd!: Date;
  public value!: number;
  public valueType!: string;
  public minimumPrice!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  declare addProduct: BelongsToManyAddAssociationMixin<Product, Product['id']>;
  declare removeProduct: BelongsToManyRemoveAssociationMixin<Product, Product['id']>;
}

Vouchers.belongsToMany(Product, {
  through: ProductHasVouchers,
  as: 'product',
  foreignKey: 'productId',
  sourceKey: 'id',
  otherKey: 'voucherId',
  timestamps: true,
});
Product.belongsToMany(Vouchers, {
  through: ProductHasVouchers,
  as: 'voucher',
  foreignKey: 'voucherId',
  sourceKey: 'id',
  otherKey: 'productId',
  timestamps: true,
});

Vouchers.init(
  {
    ...baseModelInit,
    name: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    type: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    dateStart: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    dateEnd: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    value: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    valueType: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    minimumPrice: {
      type: DataTypes.INTEGER(),
      allowNull: true,
    },
  },
  { ...baseModelConfig, modelName: 'vouchers', tableName: 'vouchers' }
);
