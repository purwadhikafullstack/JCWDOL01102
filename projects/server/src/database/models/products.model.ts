import { DataTypes, Optional } from 'sequelize';
import BaseModel, { BaseModelAttributes, baseModelConfig, baseModelInit } from './base.model';

export interface ProductAttributes extends BaseModelAttributes {
  category_id: number;
  image_id: number;
  name: string;
  price: number;
  stock: number;
  branch_id: number;
  weight: number;
  desc: string;
}

export interface ProductCreationAttributes extends Optional<ProductAttributes, 'id'> {}

class Products extends BaseModel<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  public category_id!: number;
  public image_id!: number;
  public name!: string;
  public price!: number;
  public stock!: number;
  public branch_id!: number;
  public weight!: number;
  public desc!: string;
}

Products.init(
  {
    ...baseModelInit,
    category_id: {
      type: DataTypes.INTEGER(),
      allowNull: false,
    },
    image_id: {
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
    branch_id: {
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

export default Products;
