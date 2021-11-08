import RedisCache from '@shared/cache/RedisCache';
import { getCustomRepository } from 'typeorm';
import { PaginationAwareObject } from 'typeorm-pagination/dist/helpers/pagination';
import CustomersRepository from '../typeorm/repositories/CustomersRepository';
//import Customer from '../typeorm/entities/Customer';

// interface IPaginateCustomer {
//   from: number;
//   to: number;
//   per_page: number;
//   total: number;
//   current_page: number;
//   prev_page: number | null;
//   next_page: number | null;
//   data: Customer[];
// }
class ListCustomerService {
  public async execute(): Promise<PaginationAwareObject> {
    const customerRepository = getCustomRepository(CustomersRepository);

    const redisCache = new RedisCache();

    let customers = await redisCache.recover<PaginationAwareObject>(
      'api-vendas-CUSTOMER_LIST',
    );

    if (!customers) {
      customers = await customerRepository.createQueryBuilder().paginate();
      await redisCache.save('api-vendas-CUSTOMER_LIST', customers);
    }

    return customers;
  }
}

export default ListCustomerService;
