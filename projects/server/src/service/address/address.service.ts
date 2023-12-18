import Addresses, { AddressCreationAttributes } from '../../database/models/address.model';
import { UnprocessableEntityException } from '../../helper/Error/UnprocessableEntity/UnprocessableEntityException';

export class AddressService {
  async createAddress(id: number, input: AddressCreationAttributes): Promise<Addresses> {
    const count = await Addresses.count({ where: { userId: id } });
    if (count === 0) input.isDefault = true;
    const nameExists = await Addresses.findOne({ where: { name: input.name, userId: id } });
    if (nameExists) throw new UnprocessableEntityException('Address name already exists', { name: input.name });
    if (input.isDefault) await Addresses.bulkUpdate({ isDefault: false }, { userId: id });
    const address = await Addresses.create({ ...input, userId: id, isDeleted: false });
    return address;
  }

  async getAddressList(id: number): Promise<Addresses[]> {
    const addressList = await Addresses.findAll({ where: { userId: id, isDeleted: false } });
    return addressList;
  }

  async changeDefaultAddress(id: number, addressId: number): Promise<Addresses> {
    const isExists = await Addresses.findOne({ where: { id: addressId, userId: id } });
    if (!isExists) throw new UnprocessableEntityException('Address not found', { id: addressId });
    await Addresses.bulkUpdate({ isDefault: false }, { userId: id });
    const address = await Addresses.updateById<Addresses>(addressId, { isDefault: true });
    return address;
  }

  async updateAddress(id: number, addressId: number, input: Partial<Addresses>): Promise<Addresses> {
    const isExists = await Addresses.findOne({ where: { id: addressId, userId: id } });
    if (!isExists) throw new UnprocessableEntityException('Address not found', { id: addressId });
    if (input.isDefault) await Addresses.bulkUpdate({ isDefault: false }, { userId: id });
    const nameExists = await Addresses.findOne({ where: { name: input.name, userId: id } });
    if (nameExists && isExists.id !== nameExists.id)
      throw new UnprocessableEntityException('Address name already exists', { name: input.name });
    const address = await Addresses.updateById<Addresses>(addressId, input);
    return address;
  }

  async getAddressById(id: number, addressId: number): Promise<Addresses> {
    const address = await Addresses.findOne({ where: { id: addressId, userId: id } });
    if (!address) throw new UnprocessableEntityException('Address not found', { id: addressId });
    return address;
  }
}
