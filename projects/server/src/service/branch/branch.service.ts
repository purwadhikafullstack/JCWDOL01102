import Branch, { BranchAttributes } from '../../database/models/branch.model';
import HaversineService from '../haversine/haversine';
import { IHaversineInput } from '../haversine/interface';
import { IBranchWithDistanceAttributes } from './interface';

export default class BranchService {
  private haversineService: HaversineService;

  constructor() {
    this.haversineService = new HaversineService();
  }
  async getAllBranch(): Promise<BranchAttributes[]> {
    try {
      const branches = await Branch.findAll({
        attributes: ['id', 'name', 'latitude', 'longitude'],
      });
      return branches;
    } catch (e: any) {
      throw new Error(`Error getting branch : ${e.message}`);
    }
  }

  async getNearestBranch(input: IHaversineInput): Promise<IBranchWithDistanceAttributes> {
    try {
      const branches = await Branch.findAll({
        attributes: ['id', 'name', 'latitude', 'longitude'],
      });
      const branchesWithDistance = branches
        .map((branch) => {
          const distanceToUser = this.haversineService.calculateDistance(input, {
            latitude: Number(branch.latitude),
            longitude: Number(branch.longitude),
          });
          const obj: IBranchWithDistanceAttributes = { ...branch.toJSON(), distanceToUser };
          return obj;
        })
        .sort((a, b) => a.distanceToUser - b.distanceToUser);
      return branchesWithDistance[0];
    } catch (e: any) {
      throw new Error(`Error getting branch : ${e.message}`);
    }
  }
}
