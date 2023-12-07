import { DataTypes, Model, Optional } from 'sequelize';
import Database from '../../config/db';

const databaseInstance = Database.database;

export interface UserAttributes {
  province_id: number;
  province_name: string;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'province_id'> {}
export interface UserUpdateAttributes extends Partial<UserAttributes> {}

class Provinces extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public province_id!: number;
  public province_name!: string;
}

Provinces.init(
  {
    province_id: {
      type: new DataTypes.INTEGER(),
      allowNull: false,
    },
    province_name: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize: databaseInstance,
    tableName: 'rajaongkir_provinces',
  }
);

export default Provinces;
