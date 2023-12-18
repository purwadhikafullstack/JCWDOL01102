import PaymentGateway, { PaymentGatewayAttributes } from '../../database/models/paymentGateway.mode';

export class PaymentGatewayService {
  async findByCode(code: string): Promise<PaymentGatewayAttributes> {
    const paymentGateway = await PaymentGateway.findOne({
      where: {
        code,
      },
    });
    if (!paymentGateway) {
      throw new Error('Payment gateway not found');
    }
    return paymentGateway.toJSON();
  }

  async getAll(): Promise<PaymentGateway[]> {
    const paymentGateways = await PaymentGateway.findAll({
      attributes: ['id', 'name', 'logoUrl', 'code', 'type'],
    });
    return paymentGateways;
  }
}
