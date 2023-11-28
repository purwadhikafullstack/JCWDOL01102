import { DataTypes, Optional } from 'sequelize';
import BaseModel, { BaseModelAttributes, baseModelInit, baseModelConfig } from './base.model';
import Roles from './role.model';
import RoleHasPermissions from './roleHasPermission.model';

export interface PermissionAttributes extends BaseModelAttributes {
  permission: string;
  description: string;
}

export interface PermissionCreationAttributes extends Optional<PermissionAttributes, 'id'> {}
export default class Permissions
  extends BaseModel<PermissionAttributes, PermissionCreationAttributes>
  implements PermissionAttributes
{
  public id!: number;
  public permission!: string;
  public description!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

Permissions.init(
  {
    ...baseModelInit,
    permission: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    ...baseModelConfig,
    tableName: 'permissions',
  }
);

Permissions.belongsToMany(Roles, {
  through: RoleHasPermissions,
  as: 'role',
  foreignKey: 'permission_id',
  //   sourceKey: 'id',
});

Roles.belongsToMany(Permissions, {
  through: RoleHasPermissions,
  as: 'permission',
  foreignKey: 'role_id',
  //   sourceKey: 'id',
});
