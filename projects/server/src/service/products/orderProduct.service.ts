import Product from '../../database/models/products.model';
import ProductService from './product.service';

export class OrderProductService {
  productService: ProductService;
  constructor() {
    this.productService = new ProductService();
  }

  async getMultipleProduct(productIds: string) {
    // example productIds = '1,2,3,4,5'
    const arrProducts = productIds.split(',');
    const products = await Product.findAll({
      where: {
        id: arrProducts,
      },
    });

    const data = (await Promise.all(
      products.map(async (product) => {
        return {
          ...(await this.productService.buildResponsePayload(product.toJSON())),
        };
      })
    )) as unknown as Product[];
    return data;
  }
}
