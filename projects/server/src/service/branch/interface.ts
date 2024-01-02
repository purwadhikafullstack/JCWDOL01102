import { BranchAttributes } from '../../database/models/branch.model';

export interface IBranchWithDistanceAttributes extends BranchAttributes {
  distanceToUser: number;
}
