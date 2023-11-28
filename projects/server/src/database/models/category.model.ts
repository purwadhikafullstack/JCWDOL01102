import { DataTypes, Optional } from 'sequelize';
import BaseModel, { BaseModelAttributes, baseModelConfig, baseModelInit } from './base.model';

// Category Interface
export interface CategoryAttributes extends BaseModelAttributes {
  name: string;
  branchId: number;
}

export interface CategoryCreationAttributes extends Optional<CategoryAttributes, 'id'> {}

// Sequelize Model
class Category extends BaseModel<CategoryAttributes, CategoryCreationAttributes> implements CategoryAttributes {
  public name!: string;
  public branchId!: number;
}

Category.init(
  {
    ...baseModelInit,
    name: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    branchId: {
      type: DataTypes.INTEGER(),
      allowNull: true,
    },
  },
  {
    ...baseModelConfig,
    tableName: 'categories',
  }
);

export default Category;
