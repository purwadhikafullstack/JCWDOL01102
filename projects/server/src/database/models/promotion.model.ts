import { DataTypes, Optional } from 'sequelize';
import BaseModel, { BaseModelAttributes, baseModelInit, baseModelConfig } from './base.model';
import Product from './products.model';

interface PromotionAttributes extends BaseModelAttributes {
  name: string;
  branchId: number;
  type: string;
  dateStart: Date;
  dateEnd: Date;
  value: number;
  valueType: string;
  productId: number;
}

export interface PromotionCreationAttributes extends Optional<PromotionAttributes, 'id'> {}
export interface PromotionUpdateAttributes extends Partial<PromotionAttributes> {}

export default class Promotions
  extends BaseModel<PromotionAttributes, PromotionCreationAttributes>
  implements PromotionAttributes
{
  public id!: number;
  public branchId!: number;
  public name!: string;
  public type!: string;
  public dateStart!: Date;
  public dateEnd!: Date;
  public value!: number;
  public valueType!: string;
  public productId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

Promotions.init(
  {
    ...baseModelInit,
    name: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    branchId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
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
      allowNull: true,
    },
    valueType: {
      type: new DataTypes.STRING(255),
      allowNull: true,
    },
  },
  { ...baseModelConfig, modelName: 'promotions', tableName: 'promotions' }
);

Promotions.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
Product.hasMany(Promotions, { sourceKey: 'id', foreignKey: 'product_id', as: 'promotion' });
