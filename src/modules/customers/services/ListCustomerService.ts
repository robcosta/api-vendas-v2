import redisCache from '@shared/cache/RedisCache';
import { inject, injectable } from 'tsyringe';
import { IListCustomer } from '../domain/models/IListCustomer';
import { ICustomersRepository } from '../domain/repositories/ICustomersRepository';

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
@injectable()
class ListCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customerRepository: ICustomersRepository,
  ) {}

  public async execute(): Promise<IListCustomer> {
    let customers = await redisCache.recover<IListCustomer>(
      'api-vendas-CUSTOMER_LIST',
    );

    if (!customers) {
      customers = await this.customerRepository.findAll();
      await redisCache.save('api-vendas-CUSTOMER_LIST', customers);
    }

    return customers;
  }
}

export default ListCustomerService;
