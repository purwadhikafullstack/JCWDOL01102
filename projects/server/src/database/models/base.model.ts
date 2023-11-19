import { Model, DataTypes, Optional } from 'sequelize';
import Database from '../../config/db';

const databaseInstance = Database.database;

interface SearchCondition {
  keyValue: string;
  operator: symbol;
  keySearch: string;
  keyColumn?: string;
}

export interface BaseModelAttributes {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

class BaseModel<
  TAttributes extends BaseModelAttributes,
  TCreationAttributes extends Optional<TAttributes, 'id'>
> extends Model<TAttributes, TCreationAttributes> {
  public id!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;

  static async paginate(
    page: number,
    limit: number,
    searchConditions: SearchCondition[] = []
  ): Promise<{
    data: any[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
  }> {
    const offset = (page - 1) * limit;

    const whereConditions: { [key: string]: any } = {};

    // Apply custom search conditions
    for (const condition of searchConditions) {
      //   if (condition.operator === Op.gte || condition.operator === Op.lte) {
      whereConditions[condition.keyColumn ?? condition.keySearch] = {
        [condition.operator]: condition.keyValue,
        // };
      };
    }

    const results = await this.findAndCountAll({
      where: whereConditions,
      offset,
      limit,
    });

    return {
      data: results.rows,
      totalItems: results.count,
      totalPages: Math.ceil(results.count / limit),
      currentPage: page,
    };
  }

  static async updateById(id: number, data: any): Promise<any> {
    await this.update(data, {
      where: {
        id,
      },
    });
    const updatedData = await this.findOne({
      where: {
        id,
      },
    });
    return updatedData;
  }

  static async bulkUpdate(data: any, where: any): Promise<any> {
    await this.update(data, {
      where,
    });
    const updatedData = await this.findAll({
      where,
    });
    return updatedData;
  }

  static async softDeleteById(id: number): Promise<any> {
    await this.update(
      {
        deletedAt: new Date(),
      },
      {
        where: {
          id,
        },
      }
    );

    return true;
  }

  static async softDelete(where: any): Promise<any> {
    await this.update(
      {
        deletedAt: new Date(),
      },
      {
        where,
      }
    );

    return true;
  }
}

BaseModel.init(
  {
    id: {
      type: new DataTypes.INTEGER(),
      autoIncrement: true,
      primaryKey: true,
    },
    createdAt: {
      type: new DataTypes.DATE(),
      allowNull: false,
    },
    updatedAt: {
      type: new DataTypes.DATE(),
      allowNull: false,
    },
    deletedAt: {
      type: new DataTypes.DATE(),
      allowNull: true,
    },
  },
  {
    sequelize: databaseInstance,
    modelName: 'BaseModel',
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);
export const baseModelInit = {
  id: {
    type: new DataTypes.INTEGER(),
    autoIncrement: true,
    primaryKey: true,
  },
  createdAt: {
    type: new DataTypes.DATE(),
    allowNull: false,
  },
  updatedAt: {
    type: new DataTypes.DATE(),
    allowNull: false,
  },
  deletedAt: {
    type: new DataTypes.DATE(),
    allowNull: true,
  },
};

export const baseModelConfig = {
  sequelize: databaseInstance,
  modelName: 'BaseModel',
  timestamps: true,
  paranoid: true,
  underscored: true,
};
export default BaseModel;
