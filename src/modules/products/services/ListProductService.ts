import redisCache from '@shared/cache/RedisCache';
import { getCustomRepository } from 'typeorm';
import { PaginationAwareObject } from 'typeorm-pagination/dist/helpers/pagination';
import ProductRepository from '../infra/typeorm/repositories/ProductsRepository';

class ListProductService {
  public async execute(): Promise<PaginationAwareObject> {
    const productsRepository = getCustomRepository(ProductRepository);

    //const redisCache = new RedisCache();

    let products = await redisCache.recover<PaginationAwareObject>(
      'api-vendas-PRODUCT_LIST',
    );

    if (!products) {
      products = await productsRepository.createQueryBuilder().paginate();
      await redisCache.save('api-vendas-PRODUCT_LIST', products);
    }

    return products;
  }
}
export default ListProductService;
