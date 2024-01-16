import { DataTypes, Optional } from 'sequelize';
import BaseModel, { BaseModelAttributes, baseModelInit, baseModelConfig } from './base.model';

export interface PaymentGatewayAttributes extends BaseModelAttributes {
  type: string;
  code: string;
  name: string;
  serviceName: string;
  config: string;
  logoUrl?: string;
}

export interface PaymentGatewayCreationAttributes extends Optional<PaymentGatewayAttributes, 'id'> {}
export interface PaymentGatewayInstance extends Required<PaymentGatewayAttributes> {}

class PaymentGateway
  extends BaseModel<PaymentGatewayAttributes, PaymentGatewayCreationAttributes>
  implements PaymentGatewayAttributes
{
  public id!: number;
  public type!: string;
  public code!: string;
  public name!: string;
  public serviceName!: string;
  public config!: string;
  public logoUrl?: string;
}

PaymentGateway.init(
  {
    ...baseModelInit,
    type: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    code: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    name: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    serviceName: {
      type: new DataTypes.STRING(255),
      allowNull: true,
    },
    config: {
      type: new DataTypes.JSON(),
      allowNull: true,
    },
    logoUrl: {
      type: new DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    ...baseModelConfig,
    tableName: 'payment_gateways',
  }
);

export default PaymentGateway;
