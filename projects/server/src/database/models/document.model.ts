import { DataTypes, Optional } from 'sequelize';

import BaseModel, { BaseModelAttributes, baseModelConfig, baseModelInit } from './base.model';

export interface DocumentAttributes extends BaseModelAttributes {
  bucketName?: string;
  fileName?: string;
  pathName?: string;
  uniqueId?: string;
  isDeleted?: boolean;
}

export interface DocumentCreationAttributes extends Optional<DocumentAttributes, 'id'> {}
export interface DocumentInstance extends Required<DocumentAttributes> {}

class Documents extends BaseModel<DocumentAttributes, DocumentCreationAttributes> implements DocumentAttributes {
  public bucketName!: string;
  public fileName!: string;
  public pathName!: string;
  public uniqueId!: string;
  public isDeleted!: boolean;
}

Documents.init(
  {
    ...baseModelInit,

    bucketName: {
      type: new DataTypes.STRING(255),
      allowNull: true,
      field: 'bucket_name',
    },
    fileName: {
      type: new DataTypes.STRING(255),
      allowNull: true,
      field: 'file_name',
    },
    pathName: {
      type: new DataTypes.STRING(255),
      allowNull: true,
      field: 'path_name',
    },
    uniqueId: {
      type: new DataTypes.STRING(255),
      allowNull: true,
      field: 'unique_id',
    },
    isDeleted: {
      type: new DataTypes.STRING(255),
      allowNull: true,
      field: 'is_deleted',
    },
  },
  {
    ...baseModelConfig,
    tableName: 'documents',
  }
);

export default Documents;
