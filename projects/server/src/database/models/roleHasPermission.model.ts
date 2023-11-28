import { DataTypes, Optional } from 'sequelize';
import BaseModel, { BaseModelAttributes, baseModelInit, baseModelConfig } from './base.model';

export interface RoleHasPermissionAttributes extends BaseModelAttributes {
  role_id: number;
  permission_id: number;
}

export interface RoleHasPermissionsCreationAttributes extends Optional<RoleHasPermissionAttributes, 'id'> {}
export default class RoleHasPermissions extends BaseModel<
  RoleHasPermissionAttributes,
  RoleHasPermissionsCreationAttributes
> {
  public id!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

RoleHasPermissions.init(
  {
    ...baseModelInit,
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    permission_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    ...baseModelConfig,
    tableName : 'role_has_permissions'
  }
);
