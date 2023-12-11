import { DataTypes, Optional } from 'sequelize';
import BaseModel, { BaseModelAttributes, baseModelConfig, baseModelInit } from './base.model';
import Roles from './role.model';
import Branch from './branch.model';

// User Interface
export interface UserAttributes extends BaseModelAttributes {
  image_id: number | null;
  branch_id?: number | null;
  name: string;
  email: string;
  address: string;
  phoneNumber: string;
  referralCode: string | null;
  role_id: number;
  birthdate?: Date | null;
  isDeleted: boolean;
  isVerified: boolean;
  resetPasswordToken?: string | null;
  verifyToken?: string | null;
  password: string;
  role?: { role: string; permission: { permission: string }[] };
  branch?: { name: string };
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}
// export interface UserInstance extends Required<UserAttributes> {}
// Sequelize Model
class Users extends BaseModel<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public image_id!: number | null;
  public branch_id!: number | null;
  public name!: string;
  public email!: string;
  public password!: string;
  public address!: string;
  public phoneNumber!: string;
  public referralCode!: string | null;
  public role_id!: number;
  public birthdate!: Date | null;
  public isDeleted!: boolean;
  public isVerified!: boolean;
  public resetPasswordToken!: string | null;
  public verifyToken!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

Users.init(
  {
    ...baseModelInit,
    image_id: {
      type: DataTypes.INTEGER(),
      allowNull: true,
    },
    branch_id: {
      type: DataTypes.INTEGER(),
      allowNull: true,
    },
    name: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    password: {
      type: new DataTypes.STRING(255),
      allowNull: true,
    },
    address: {
      type: new DataTypes.STRING(255),
      allowNull: true,
    },
    phoneNumber: {
      type: new DataTypes.STRING(255),
      allowNull: true,
      field: 'phone_number',
    },
    referralCode: {
      type: new DataTypes.STRING(255),
      allowNull: false,
      field: 'referral_code',
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    birthdate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: 'is_deleted',
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: 'is_verified',
    },
    resetPasswordToken: {
      type: new DataTypes.STRING(255),
      allowNull: true,
      field: 'reset_password_token',
    },
    verifyToken: {
      type: new DataTypes.STRING(255),
      allowNull: true,
      field: 'verify_token',
    },
  },
  {
    ...baseModelConfig,
    tableName: 'users',
  }
);

Users.belongsTo(Roles, { foreignKey: 'role_id', as: 'role' });
Roles.hasMany(Users, { sourceKey: 'id', foreignKey: 'role_id', as: 'user' });

Users.belongsTo(Branch, { foreignKey: 'branch_id', as: 'branch' });
Branch.hasMany(Users, { sourceKey: 'id', foreignKey: 'branch_id', as: 'user' });

export default Users;
