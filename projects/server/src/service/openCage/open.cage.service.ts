import * as opencage from 'opencage-api-client';
import configConstants from '../../config/constants';
export class OpenCageService {
  async forwardGeocode(query: string): Promise<any> {
    try {
      const result = await opencage.geocode({ q: query, language: 'id', key: configConstants.OPEN_CAGE_API_KEY });
      return result;
    } catch (error) {
      throw error;
    }
  }
}
