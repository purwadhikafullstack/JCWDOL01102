import { DataTypes, Model, Optional } from 'sequelize';
import Database from '../../config/db';

// Database connection instance
const databaseInstance = Database.database;

// User Interface
export interface UserAttributes {
  id: number;
  image_id?: number | null;
  branch_id?: number | null;
  name: string;
  email: string;
  address: string;
  phone_number: string;
  referral_code: string | null;
  role_id: number;
  birthdate?: Date | null;
  is_deleted: boolean;
  is_verified: boolean;
  reset_password_token?: string | null;
  verify_token?: string | null;
  password: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}
export interface UserInstance extends Required<UserAttributes> {}
// Sequelize Model
class Users extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public image_id!: number | null;
  public branch_id!: number | null;
  public name!: string;
  public email!: string;
  public password!: string;
  public address!: string;
  public phone_number!: string;
  public referral_code!: string | null;
  public role_id!: number;
  public birthdate!: Date | null;
  public is_deleted!: boolean;
  public is_verified!: boolean;
  public reset_password_token!: string | null;
  public verify_token!: string | null;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Users.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    image_id: {
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
    phone_number: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    referral_code: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    birthdate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    reset_password_token: {
      type: new DataTypes.STRING(255),
      allowNull: true,
    },
    verify_token: {
      type: new DataTypes.STRING(255),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE(),
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.DATE(),
      allowNull: true,
    },
  },
  {
    tableName: 'users',
    sequelize: databaseInstance,
    timestamps: false,
  }
);

export default Users;
