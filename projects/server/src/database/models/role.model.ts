import { DataTypes, Optional } from 'sequelize';
import BaseModel, { BaseModelAttributes, baseModelInit, baseModelConfig } from './base.model';

export interface RoleAtrributes extends BaseModelAttributes {
  role: string;
}

export interface RoleCreationAttributes extends Optional<RoleAtrributes, 'id'> {}

export default class Roles extends BaseModel<RoleAtrributes, RoleCreationAttributes> implements RoleAtrributes {
  public id!: number;
  public role!: string;
  public readonly createdAt!: Date;
  public readonly deletedAt!: Date;
  public readonly updatedAt!: Date;
}

Roles.init(
  {
    ...baseModelInit,
    role: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    ...baseModelConfig,
    tableName: 'user_roles',
  }
);
