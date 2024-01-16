import axios from 'axios';
import { Op } from 'sequelize';
import configConstants from '../../config/constants';
import Cities from '../../database/models/city.model';
import { BadRequestException } from '../../helper/Error/BadRequestException/BadRequestException';
import { IRequestRajaOngkir, RajaOngkirResponse } from './interface';

export class RajaOngkirService {
  async checkOngkir(input: IRequestRajaOngkir): Promise<RajaOngkirResponse> {
    const city = await Cities.findAll({
      where: {
        city_id: {
          [Op.or]: [input.origin, input.destination],
        },
      },
      attributes: ['city_id'],
    });
    if (city.length !== 2) {
      throw new BadRequestException('Origin or destination not found');
    }

    const response = await axios.post<RajaOngkirResponse>(configConstants.RAJA_ONGKIR_URL + '/starter/cost', input, {
      headers: {
        content_type: 'application/x-www-form-urlencoded',
        key: configConstants.RAJA_ONGKIR_KEY,
      },
    });
    return response.data;
  }
}
