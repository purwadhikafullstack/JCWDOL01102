import { DataTypes, Optional } from 'sequelize';
import BaseModel, { BaseModelAttributes, baseModelInit, baseModelConfig } from './base.model';

export interface ConfigAttributes extends BaseModelAttributes {
  module: string;
  name: string;
  data: any;
}

export interface ConfigCreationAttributes extends Optional<ConfigAttributes, 'id'> {}

class Configs extends BaseModel<ConfigAttributes, ConfigCreationAttributes> implements ConfigAttributes {
  public module!: string;
  public name!: string;
  public data!: any;
}

// Additional configuration for Configs if needed
Configs.init(
  {
    ...baseModelInit,
    module: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    name: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    data: {
      type: new DataTypes.JSON(),
      allowNull: false,
    },
  },
  {
    ...baseModelConfig,
    modelName: 'configs',
  }
);

export default Configs;
