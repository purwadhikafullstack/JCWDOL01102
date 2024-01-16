import axios, { AxiosError } from 'axios';
import * as crypto from 'crypto';
import { DateTime } from 'luxon';
import { orderStatusConstants } from '../../config/orderConstants';
import Order from '../../database/models/order.model';
import OrderStatus from '../../database/models/orderStatus.model';
import { UnprocessableEntityException } from '../../helper/Error/UnprocessableEntity/UnprocessableEntityException';
import { getUniqId } from '../../helper/function/getUniqId';
import { IPostOrderResponse } from '../order/interface';

interface DokuPaymentCode {
  payload: object;
  paymentUrl: string;
  requestId: string;
  requestTarget: string;
  timestamp: string;
}

export default class DokuService {
  async generatePaymentCode(input: DokuPaymentCode) {
    try {
      const digest = await this.generateDigest(input.payload);
      const secretKey = 'SK-7WH5ubv2ga7SWwFhkh29';
      const signatureString = `Client-Id:BRN-0206-1695445608025\nRequest-Id:${input.requestId}\nRequest-Timestamp:${input.timestamp}\nRequest-Target:${input.requestTarget}\nDigest:${digest}`;
      const hmac = crypto.createHmac('sha256', secretKey);
      hmac.update(signatureString);
      const signature = `HMACSHA256=${hmac.digest('base64')}`;

      const headers = {
        'Content-Type': 'application/json',
        'Client-Id': 'BRN-0206-1695445608025',
        'Request-Id': input.requestId,
        'Request-Timestamp': input.timestamp,
        Signature: signature,
      };
      const result = await axios.post(input.paymentUrl, input.payload, {
        headers,
      });
      return result.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const err = error as AxiosError;
        console.log('ERROR STATUS', err.response?.status);
        throw new UnprocessableEntityException('Error when generate payment code', err.response?.data);
      }
      throw error;
    }

    //end of method
  }

  async generateDigest(payload: any): Promise<string | null> {
    try {
      // Convert the payload JSON object to a string
      const payloadString = JSON.stringify(payload);

      // Calculate the SHA256 hash
      const sha256Hash = crypto.createHash('sha256').update(payloadString).digest();

      // Convert the hash to base64
      const base64Hash = sha256Hash.toString('base64');

      return base64Hash;
    } catch (error) {
      // Handle any errors that might occur during the process
      console.error('Error generating Digest:', error);
      return null;
    }
  }

  async paymentBcaVa({
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
    const paymentUrl = 'https://api-sandbox.doku.com/bca-virtual-account/v2/payment-code';
    const timestamp = DateTime.utc().toISO()?.toString() as string;
    const requestId = 'BCA_VA' + getUniqId({ length: 32 });
    const requestTarget = '/bca-virtual-account/v2/payment-code';

    const getPaymentCode = await this.generatePaymentCode({
      payload,
      paymentUrl,
      requestId,
      requestTarget,
      timestamp,
    });
    return getPaymentCode as IPostOrderResponse;
  }

  async handlePaymentNotification(headers: any, payload: any) {
    const Digest = await this.generateDigest(payload);
    const clientId = headers['client-id'];
    const requestId = headers['request-id'];
    const requestTimestamp = headers['request-timestamp'];
    const requestTarget = '/api/external/doku-payment-notification';
    const secretKey = 'SK-7WH5ubv2ga7SWwFhkh29';
    const signatureString =
      `Client-Id:${clientId}\n` +
      `Request-Id:${requestId}\n` +
      `Request-Timestamp:${requestTimestamp}\n` +
      `Request-Target:${requestTarget}\n` +
      `Digest:${Digest}`;
    console.log(`\nSIGNATURE STRING\n${signatureString}`);
    const hmac = crypto.createHmac('sha256', secretKey);
    hmac.update(signatureString);
    const signature = `HMACSHA256=${hmac.digest('base64')}`;
    console.log('\nSIGNATURE1', signature);
    console.log('SIGNATURE2', headers['signature']);
    // if (signature !== headers["signature"]) {
    //   throw new UnprocessableEntityException("Invalid Signature", {});
    // }

    if (payload.transaction.status === 'SUCCESS') {
      console.log('PAYMENT SUCCESS');
      const invoiceNumber = payload.order.invoice_number;

      const order = await Order.update(
        { status: orderStatusConstants.payment_success.code },
        { where: { invoiceNo: invoiceNumber } }
      );
      const getOrder = await Order.findOne({ where: { invoiceNo: invoiceNumber } });
      await OrderStatus.create({
        orderId: getOrder?.id as number,
        status: orderStatusConstants.payment_success.code,
      });

      console.log('ORDER', order);
    }
  }
}
