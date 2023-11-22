import Addresses, { AddressCreationAttributes } from '../../database/models/address.model';

export class AddressService {
  async createAddress(id: number, input: AddressCreationAttributes): Promise<Addresses> {
    const address = await Addresses.create({ ...input, userId: id, isDeleted: false });
    return address;
  }
}
