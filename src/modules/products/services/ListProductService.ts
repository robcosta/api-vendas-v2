import redisCache from '@shared/cache/RedisCache';
import { inject, injectable } from 'tsyringe';
import { IListProduct } from '../domain/models/IListProduct';
import { IProductsRepository } from '../domain/repositories/IProductsRepository';

@injectable()
class ListProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute(): Promise<IListProduct> {
    let products = await redisCache.recover<IListProduct>(
      'api-vendas-PRODUCT_LIST',
    );

    if (!products) {
      products = await this.productsRepository.findAll();
      await redisCache.save('api-vendas-PRODUCT_LIST', products);
    }

    return products;
  }
}
export default ListProductService;
