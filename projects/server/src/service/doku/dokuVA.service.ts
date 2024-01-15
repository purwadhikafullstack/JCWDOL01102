import { DateTime } from 'luxon';
import DokuService from './doku.service';
import { getUniqId } from '../../helper/function/getUniqId';
import { IPostOrderResponse } from '../order/interface';

export class DokuVAService {
  dokuService: DokuService;
  constructor() {
    this.dokuService = new DokuService();
  }
  async paymentBniVa({
    invoiceNumber,
    amount,
    email,
    name,
  }: {
    invoiceNumber: string;
    amount: number;
    email: string;
    name: string;
  }) {
    const payload = {
      order: {
        invoice_number: invoiceNumber,
        amount: amount,
      },
      virtual_account_info: {
        expired_time: 60,
        biling_type: 'FIXED',
        info: 'Product detail here',
        merchant_unique_reference: 'UNIQUE_000035',
      },
      customer: {
        name: name,
        email: email,
      },
      additional_info: {
        brand_name: 'DOKU',
        channel_code: 'DOKU',
        channel_merchant_id: 'DOKU',
        channel_type: 'DOKU',
      },
    };
    const paymentUrl = 'https://api-sandbox.doku.com/bni-virtual-account/v2/payment-code';
    const timestamp = DateTime.utc().toISO()?.toString() as string;
    const requestId = 'BCA_VA' + getUniqId({ length: 32 });
    const requestTarget = '/bni-virtual-account/v2/payment-code';

    const getPaymentCode = await this.dokuService.generatePaymentCode({
      payload,
      paymentUrl,
      requestId,
      requestTarget,
      timestamp,
    });
    return getPaymentCode as IPostOrderResponse;
  }

  async paymentMandiriVa({
    invoiceNumber,
    amount,
    email,
    name,
  }: {
    invoiceNumber: string;
    amount: number;
    email: string;
    name: string;
  }) {
    const payload = {
      order: {
        invoice_number: invoiceNumber,
        amount: amount,
      },
      virtual_account_info: {
        billing_type: 'FIX_BILL',
        expired_time: 60,
        reusable_status: false,
        info1: 'Merchant Demo Store',
        info2: 'Thank you for shopping',
        info3: 'on our store',
      },
      customer: {
        name: name,
        email: email,
      },
    };
    const paymentUrl = 'https://api-sandbox.doku.com/mandiri-virtual-account/v2/payment-code';
    const timestamp = DateTime.utc().toISO()?.toString() as string;
    const requestId = 'BCA_VA' + getUniqId({ length: 32 });
    const requestTarget = '/mandiri-virtual-account/v2/payment-code';

    const getPaymentCode = await this.dokuService.generatePaymentCode({
      payload,
      paymentUrl,
      requestId,
      requestTarget,
      timestamp,
    });
    return getPaymentCode as IPostOrderResponse;
  }

  async paymentBsiVa({
    invoiceNumber,
    amount,
    email,
    name,
  }: {
    invoiceNumber: string;
    amount: number;
    email: string;
    name: string;
  }) {
    const payload = {
      order: {
        invoice_number: invoiceNumber,
        amount: amount,
      },
      virtual_account_info: {
        expired_time: 60,
        reusable_status: false,
        info1: 'Merchant Demo Store',
        info2: 'Thank you for shopping',
        info3: 'on our store',
      },
      customer: {
        name: name,
        email: email,
      },
    };
    const paymentUrl = 'https://api-sandbox.doku.com/bsm-virtual-account/v2/payment-code';
    const timestamp = DateTime.utc().toISO()?.toString() as string;
    const requestId = 'BCA_VA' + getUniqId({ length: 32 });
    const requestTarget = '/bsm-virtual-account/v2/payment-code';

    const getPaymentCode = await this.dokuService.generatePaymentCode({
      payload,
      paymentUrl,
      requestId,
      requestTarget,
      timestamp,
    });
    return getPaymentCode as IPostOrderResponse;
  }

  async paymentBriVa({
    invoiceNumber,
    amount,
    email,
    name,
  }: {
    invoiceNumber: string;
    amount: number;
    email: string;
    name: string;
  }) {
    const payload = {
      order: {
        invoice_number: invoiceNumber,
        amount: amount,
      },
      virtual_account_info: {
        billing_type: 'FIX_BILL',
        expired_time: 60,
        reusable_status: false,
        info1: 'Merchant Demo Store',
        info2: 'Thank you for shopping',
        info3: 'on our store',
        info4: 'other info',
        info5: 'other info',
      },
      customer: {
        name: name,
        email: email,
      },
    };
    const paymentUrl = 'https://api-sandbox.doku.com/bsm-virtual-account/v2/payment-code';
    const timestamp = DateTime.utc().toISO()?.toString() as string;
    const requestId = 'BCA_VA' + getUniqId({ length: 32 });
    const requestTarget = '/bsm-virtual-account/v2/payment-code';

    const getPaymentCode = await this.dokuService.generatePaymentCode({
      payload,
      paymentUrl,
      requestId,
      requestTarget,
      timestamp,
    });
    return getPaymentCode as IPostOrderResponse;
  }
}
