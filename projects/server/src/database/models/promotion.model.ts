import { DataTypes, Optional } from 'sequelize';
import BaseModel, { BaseModelAttributes, baseModelInit, baseModelConfig } from './base.model';

interface PromotionAttributes extends BaseModelAttributes {
  name: string;
  type: string;
  dateStart: Date;
  dateEnd: Date;
  value: number;
  valueType: string;
}

export interface PromotionCreationAttributes extends Optional<PromotionAttributes, 'id'> {}
export interface PromotionUpdateAttributes extends Partial<PromotionAttributes> {}

export default class Promotions
  extends BaseModel<PromotionAttributes, PromotionCreationAttributes>
  implements PromotionAttributes
{
  public id!: number;
  public name!: string;
  public type!: string;
  public dateStart!: Date;
  public dateEnd!: Date;
  public value!: number;
  public valueType!: string;
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
  },
  { ...baseModelConfig, modelName: 'promotions', tableName: 'promotions' }
);
