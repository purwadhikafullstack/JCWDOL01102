import { DataTypes, Model, Optional } from 'sequelize';
import Database from '../../config/db';

const databaseInstance = Database.database;

// 1	city_id	int	NULL	NULL	NO	NULL
// 2	province_id	int	NULL	NULL	NO	NULL
// 3	city_name	varchar(255)	utf8mb4	utf8mb4_0900_ai_ci	NO	NULL
// 4	postal_code	char(5)	utf8mb4	utf8mb4_0900_ai_ci	NO	NULL

export interface CityAttributes {
  city_id: number;
  province_id: number;
  city_name: string;
  postal_code: string;
}

export interface CityCreationAttributes extends Optional<CityAttributes, 'city_id'> {}
export interface CityUpdateAttributes extends Partial<CityAttributes> {}

class Cities extends Model<CityAttributes, CityCreationAttributes> implements CityAttributes {
  public city_id!: number;
  public province_id!: number;
  public city_name!: string;
  public postal_code!: string;
}

Cities.init(
  {
    city_id: {
      type: new DataTypes.INTEGER(),
      allowNull: false,
    },
    province_id: {
      type: new DataTypes.INTEGER(),
      allowNull: false,
    },
    city_name: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    postal_code: {
      type: new DataTypes.STRING(5),
      allowNull: false,
    },
  },
  {
    sequelize: databaseInstance,
    tableName: 'rajaongkir_cities',
  }
);

export default Cities;
