import ProductService from '../../service/products/product.service';

export default class ProductController {
  productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }
}
