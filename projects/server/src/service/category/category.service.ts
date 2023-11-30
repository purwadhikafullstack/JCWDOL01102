import { Op } from 'sequelize';
import Category, { CategoryAttributes } from '../../database/models/category.model';

export class CategoryService {
  async createCategory(branchId: number, data: CategoryAttributes): Promise<Category> {
    try {
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
      const categories = await Category.paginate(page, limit, [
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
      ]);

      return categories;
    } catch (error) {
      throw error;
    }
  }
}
