import redisCache from '@shared/cache/RedisCache';
import AppError from '@shared/errors/AppError';
import { ICustomerId } from '@modules/customers/domain/models/ICustomerId';
import { inject, injectable } from 'tsyringe';
import { ICustomersRepository } from '../domain/repositories/ICustomersRepository';

@injectable()
class DeleteCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ id }: ICustomerId): Promise<void> {
    const customer = await this.customersRepository.findById(id);

    if (!customer) {
      throw new AppError('Customer not found.');
    }

    await redisCache.invalidate('api-vendas-CUSTOMER_LIST');

    await this.customersRepository.remove(customer);

    return;
  }
}

export default DeleteCustomerService;
