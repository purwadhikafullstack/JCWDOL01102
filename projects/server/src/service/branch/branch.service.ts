import Branch, { BranchAttributes } from '../../database/models/branch.model';

export default class BranchService {
  async getAllBranch(): Promise<BranchAttributes[]> {
    try {
      const branches = Branch.findAll({
        attributes: ['id', 'name', 'latitude', 'longitude'],
      });
      return branches;
    } catch (e: any) {
      throw new Error(`Error getting branch : ${e.message}`);
    }
  }
}
