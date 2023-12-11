import { DataTypes, Optional } from 'sequelize';
import BaseModel, { BaseModelAttributes, baseModelConfig, baseModelInit } from './base.model';

export interface ProductAttributes extends BaseModelAttributes {
  categoryId: number;
  imageId: number;
  name: string;
  price: number;
  stock: number;
  branchId: number;
  weight: number;
  desc: string;
}

export interface ProductCreationAttributes extends Optional<ProductAttributes, 'id'> {}

class Product extends BaseModel<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  public categoryId!: number;
  public imageId!: number;
  public name!: string;
  public price!: number;
  public stock!: number;
  public branchId!: number;
  public weight!: number;
  public desc!: string;
}

Product.init(
  {
    ...baseModelInit,
    categoryId: {
      type: DataTypes.INTEGER(),
      allowNull: false,
    },
    imageId: {
      type: DataTypes.INTEGER(),
      allowNull: false,
    },
    name: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER(),
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER(),
      allowNull: false,
    },
    branchId: {
      type: DataTypes.INTEGER(),
      allowNull: false,
    },
    weight: {
      type: DataTypes.INTEGER(),
      allowNull: false,
    },
    desc: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    ...baseModelConfig,
    modelName: 'products',
  }
);

export default Product;
