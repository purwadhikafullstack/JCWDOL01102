// id, created_at, updated_at, deleted_at
import { Optional } from 'sequelize';
import BaseModel, { BaseModelAttributes, baseModelConfig, baseModelInit } from './base.model';
export interface InvoiceNoAttributes extends BaseModelAttributes {}
export interface InvoiceNoCreationAttributes extends Optional<InvoiceNoAttributes, 'id'> {}
export interface InvoiceNoInstance extends Required<InvoiceNoAttributes> {}
class InvoiceNo extends BaseModel<InvoiceNoAttributes, InvoiceNoCreationAttributes> implements InvoiceNoAttributes {
  public id!: number;
}

InvoiceNo.init(
  {
    ...baseModelInit,
  },
  {
    ...baseModelConfig,
    tableName: 'invoice_no',
  }
);

export default InvoiceNo;
