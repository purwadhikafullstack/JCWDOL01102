import Provinces from '../../database/models/provinces.mode';

export class MasterDataService {
  async getAllProvinces() {
    const provinces = await Provinces.findAll({
      attributes: ['province_id', 'province_name'],
    });
    console.log(provinces);
    return provinces;
  }
}
