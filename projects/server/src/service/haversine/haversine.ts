import { IHaversineInput } from './interface';
import haversine from 'haversine';

export default class HaversineService {
  calculateDistance(input: IHaversineInput, addressInput: IHaversineInput) {
    try {
      return haversine(input, addressInput, { unit: 'km' });
    } catch (error: any) {
      throw error;
    }
  }
}
