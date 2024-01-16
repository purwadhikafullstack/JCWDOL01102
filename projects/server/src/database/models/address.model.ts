import { DataTypes, Optional } from 'sequelize';
import BaseModel, { BaseModelAttributes, baseModelInit, baseModelConfig } from './base.model';

export interface AddressAttributes extends BaseModelAttributes {
  name: string;
  receiverName: string;
  phoneNumber: string;
  address: string;
  provinceId: number;
  userId: number;
  cityId: number;
  latitude: string;
  longitude: string;
  isDefault: boolean;
  isDeleted: boolean;
}

export interface AddressCreationAttributes extends Optional<AddressAttributes, 'id'> {}
export interface AddressUpdateAttributes extends Partial<AddressAttributes> {}

class Addresses extends BaseModel<AddressAttributes, AddressCreationAttributes> implements AddressAttributes {
  public name!: string;
  public receiverName!: string;
  public phoneNumber!: string;
  public address!: string;
  public provinceId!: number;
  public userId!: number;
  public cityId!: number;
  public latitude!: string;
  public longitude!: string;
  public isDefault!: boolean;
  public isDeleted!: boolean;
}

Addresses.init(
  {
    ...baseModelInit,
    name: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    receiverName: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    phoneNumber: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    address: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    provinceId: {
      type: new DataTypes.INTEGER(),
      allowNull: false,
    },
    userId: {
      type: new DataTypes.INTEGER(),
      allowNull: false,
    },
    cityId: {
      type: new DataTypes.INTEGER(),
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
    isDefault: {
      type: new DataTypes.BOOLEAN(),
      allowNull: false,
    },
    isDeleted: {
      type: new DataTypes.BOOLEAN(),
      allowNull: false,
    },
  },
  {
    ...baseModelConfig,
    modelName: 'addresses',
  }
);

export default Addresses;
