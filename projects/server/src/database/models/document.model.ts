import { DataTypes, Optional } from 'sequelize';
import Database from '../../config/db';
import BaseModel, { BaseModelAttributes } from './base.model';

const databaseInstance = Database.database;

export interface DocumentAttributes extends BaseModelAttributes {
  bucketName?: string;
  fileName?: string;
  pathName?: string;
  uniqueId?: string;
  isDeleted: boolean;
}

export interface DocumentCreationAttributes extends Optional<DocumentAttributes, 'id'> {}
export interface DocumentInstance extends Required<DocumentAttributes> {}

class Documents extends BaseModel<DocumentAttributes, DocumentCreationAttributes> implements DocumentAttributes {
  public id!: number;
  public bucketName!: string;
  public fileName!: string;
  public pathName!: string;
  public uniqueId!: string;
  public isDeleted!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

Documents.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
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
    createdAt: {
      type: DataTypes.DATE(),
      allowNull: true,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE(),
      allowNull: true,
      field: 'updated_at',
    },
    deletedAt: {
      type: DataTypes.DATE(),
      allowNull: true,
      field: 'created_at',
    },
  },
  {
    tableName: 'documents',
    sequelize: databaseInstance,
    timestamps: false,
  }
);

export default Documents;
