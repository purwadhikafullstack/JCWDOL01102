import { DataTypes, Optional } from 'sequelize';
import BaseModel, { BaseModelAttributes, baseModelConfig, baseModelInit } from './base.model';

// Branch Interface
export interface BranchAttributes extends BaseModelAttributes {
  name: string;
  latitude: string;
  longitude: string;
  address: string;
}

export interface BranchCreationAttributes extends Optional<BranchAttributes, 'id'> {}

// Sequelize Model
class Branch extends BaseModel<BranchAttributes, BranchCreationAttributes> implements BranchAttributes {
  public name!: string;
  public latitude!: string;
  public longitude!: string;
  public address!: string;
}

Branch.init(
  {
    ...baseModelInit,
    name: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    latitude: {
      type: new DataTypes.STRING(20),
      allowNull: false,
    },
    longitude: {
      type: new DataTypes.STRING(20),
      allowNull: false,
    },
    address: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    ...baseModelConfig,
    tableName: 'branches',
  }
);

export default Branch;
