import redisCache from '@shared/cache/RedisCache';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { IProduct } from '../domain/models/IProduct';
import { IUpdateProduct } from '../domain/models/IUpdateProduct';
import { IProductsRepository } from '../domain/repositories/IProductsRepository';

@injectable()
class UpdateProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute({
    id,
    name = undefined,
    price = undefined,
    quantity = undefined,
  }: IUpdateProduct): Promise<IProduct> {
    const product = await this.productsRepository.findById(id);

    if (!product) {
      throw new AppError('Product Not Found.');
    }

    if (name) {
      const productExists = await this.productsRepository.findByName(name);
      if (productExists && productExists.name === name) {
        throw new AppError('There is already one product with this name');
      }
    }

    product.name = name ? name : product.name;
    product.price = price !== undefined ? price : product.price;
    product.quantity = quantity !== undefined ? quantity : product.quantity;

    await redisCache.invalidate('api-vendas-PRODUCT_LIST');
    await this.productsRepository.save(product);

    return product;
  }
}

export default UpdateProductService;
