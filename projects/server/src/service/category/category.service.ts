import { Op } from 'sequelize';
import Category, { CategoryAttributes } from '../../database/models/category.model';
import Product from '../../database/models/products.model';
import { UnprocessableEntityException } from '../../helper/Error/UnprocessableEntity/UnprocessableEntityException';

export class CategoryService {
  async createCategory(branchId: number, data: CategoryAttributes): Promise<Category> {
    try {
      const isExist = await Category.findOne({
        where: {
          name: data.name,
          branchId,
        },
      });
      if (isExist)
        throw new UnprocessableEntityException('Category already exist', {
          name: data.name,
        });
      const category = await Category.create({
        ...data,
        branchId,
      });
      return category;
    } catch (error) {
      throw error;
    }
  }

  async updateById(id: number, branchId: number, data: CategoryAttributes): Promise<Category> {
    try {
      const category = await Category.findOne({
        where: {
          id,
          branchId,
        },
      });
      if (!category) throw new Error('Category not found');
      await category.update(data);
      return category;
    } catch (error) {
      throw error;
    }
  }

  async findById(id: number, branchId: number): Promise<Category> {
    try {
      const category = await Category.findOne({
        where: {
          id,
          branchId,
        },
      });
      if (!category) throw new Error('Category not found');
      return category;
    } catch (error) {
      throw error;
    }
  }

  async deleteById(id: number, branchId: number): Promise<Category> {
    try {
      const category = await Category.findOne({
        where: {
          id,
          branchId,
        },
      });
      if (!category) throw new Error('Category not found');
      await category.destroy();
      return category;
    } catch (error) {
      throw error;
    }
  }

  async allCategory(branchId: number): Promise<Category[]> {
    try {
      const categories = await Category.findAll({
        where: {
          branchId,
        },
      });
      return categories;
    } catch (error) {
      throw error;
    }
  }

  async page(page: number, limit: number, branchId: number, data: any) {
    try {
      const categories = await Category.paginate({
        page,
        limit,
        searchConditions: [
          {
            keySearch: 'name',
            keyValue: data.name,
            operator: Op.substring,
            keyColumn: 'name',
          },
          {
            keySearch: 'branchId',
            keyValue: branchId.toString(),
            operator: Op.eq,
            keyColumn: 'branchId',
          },
        ],
        sortOptions: {
          key: 'id',
          order: 'ASC',
        },
      });

      return {
        ...categories,
        data: await Promise.all(categories.data.map((category) => this.buildResponse(category))),
      };
    } catch (error) {
      throw error;
    }
  }

  async buildResponse(category: Category): Promise<any> {
    try {
      const product = await Product.count({
        where: {
          categoryId: category.id,
        },
      });
      return {
        ...category.toJSON(),
        totalProduct: product,
      };
    } catch (error) {
      throw error;
    }
  }
}
