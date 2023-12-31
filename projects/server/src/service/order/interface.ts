// {
//   "userId":1,
//   "branchId":1,
//   "products":[
//       {
//           "id":14,
//           "qty":2,
//           "price":10000
//       }
//   ],
//   "courier":{
//       "name":"Jalur Nugraha Ekakurir (JNE)",
//       "code":"REG",
//       "price":12000,
//       "etd":"1-2"
//   },
//   "discountId":[
//   ],
//   "totalAmount":10000,
//   "paymentCode":"BCA_VA"
// }
export interface IRequestOrder {
  userId: number;
  branchId: number;
  products: Product[];
  discountId: number[];
  paymentCode: string;
  courier: Courier;
  totalAmount: number;
}

interface Courier {
  name: string;
  code: string;
  price: number;
  etd: string;
}
interface Product {
  id: number;
  qty: number;
  price: number;
}

export interface IPostOrderResponse {
  order: {
    invoice_number: string;
  };
  virtual_account_info: {
    virtual_account_number: string;
    how_to_pay_page: string;
    how_to_pay_api: string;
    created_date: string;
    expired_date: string;
    created_date_utc: string;
    expired_date_utc: string;
  };
}
