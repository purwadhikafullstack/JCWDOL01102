import { DataTypes, Optional } from 'sequelize';
import BaseModel, { BaseModelAttributes, baseModelConfig, baseModelInit } from './base.model';
import Product from './products.model';
import Users from './user.model';
import Branch from './branch.model';

// Branch Interface
export interface CartAttributes extends BaseModelAttributes {
  userId: number;
  productId: number;
  branchId: number;
  qty: number;
}

export interface CartCreationAttributes extends Optional<CartAttributes, 'id'> {}
export interface CartUpdateAttributes extends Partial<CartAttributes> {}
// Sequelize Model
class Cart extends BaseModel<CartAttributes, CartCreationAttributes> implements CartAttributes {
  public userId!: number;
  public branchId!: number;
  public productId!: number;
  public qty!: number;
}

Cart.init(
  {
    ...baseModelInit,
    userId: {
      type: DataTypes.INTEGER(),
      allowNull: false,
    },
    branchId: {
      type: DataTypes.INTEGER(),
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER(),
      allowNull: false,
    },
    qty: {
      type: DataTypes.INTEGER(),
    },
  },
  {
    ...baseModelConfig,
    tableName: 'carts',
  }
);

Users.hasMany(Cart, {
  foreignKey: 'userId',
  sourceKey: '',
  as: 'cart',
});

Cart.belongsTo(Users, {
  foreignKey: 'userId',
  as: 'user',
});

Branch.hasMany(Cart, {
  sourceKey: 'id',
  foreignKey: 'branchId',
  as: 'cart',
});

Cart.belongsTo(Branch, {
  foreignKey: 'branchId',
  as: 'branch',
});

Product.hasMany(Cart, {
  sourceKey: 'id',
  foreignKey: 'productId',
  as: 'cart',
});

Cart.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product',
});

export default Cart;
