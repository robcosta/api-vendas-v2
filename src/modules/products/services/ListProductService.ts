import redisCache from '@shared/cache/RedisCache';
import { inject, injectable } from 'tsyringe';
import { IProductPaginate } from '../domain/models/IProductPaginate';
import { IProductsRepository } from '../domain/repositories/IProductsRepository';

@injectable()
class ListProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute(): Promise<IProductPaginate> {
    // const products = await this.productsRepository.findAllPaginate();
    let products = await redisCache.recover<IProductPaginate>(
      'api-vendas-PRODUCT_LIST',
    );

    console.log(products);

    if (!products) {
      products = await this.productsRepository.findAllPaginate();
      console.log('Dentro de !products', products);
      await redisCache.save('api-vendas-PRODUCT_LIST', products);
    }

    return products;
  }
}
export default ListProductService;
