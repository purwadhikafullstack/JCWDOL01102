import Cities from '../../database/models/city.model';
import Provinces from '../../database/models/provinces.mode';

export class MasterDataService {
  async getAllProvinces() {
    const provinces = await Provinces.findAll({
      attributes: ['province_id', 'province_name'],
    });
    return provinces;
  }

  async getAllCities(province_id?: number) {
    const whereCondition: any = {};
    if (province_id) {
      whereCondition.province_id = province_id;
    }

    const cities = await Cities.findAll({
      attributes: ['city_id', 'province_id', 'city_name', 'postal_code'],
      where: whereCondition,
    });
    return cities;
  }
}
