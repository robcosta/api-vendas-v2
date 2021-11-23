import redisCache from '@shared/cache/RedisCache';
import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import Product from '../infra/typeorm/entities/Product';
import ProductRepository from '../infra/typeorm/repositories/ProductsRepository';

interface IRequest {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

class UpdateProductService {
  public async execute({
    id,
    name,
    price,
    quantity,
  }: IRequest): Promise<Product> {
    const productsRepository = getCustomRepository(ProductRepository);
    const product = await productsRepository.findOne(id);

    if (!product) {
      throw new AppError('Product Not Found.');
    }

    const productExists = await productsRepository.findByName(name);

    if (productExists && productExists.name === name) {
      throw new AppError('There is already one product with this name');
    }

    if (name) product.name = name;
    if (price) product.price = price;
    if (quantity) product.quantity = quantity;

    //const redisCache = new RedisCache();
    await redisCache.invalidate('api-vendas-PRODUCT_LIST');

    await productsRepository.save(product);

    return product;
  }
}

export default UpdateProductService;
