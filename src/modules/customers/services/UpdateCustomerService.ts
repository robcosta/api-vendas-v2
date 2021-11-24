import redisCache from '@shared/cache/RedisCache';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { IUpdateCustomer } from '../domain/models/IUpdateCustomer';
import { ICustomersRepository } from '../domain/repositories/ICustomersRepository';
import Customer from '../infra/typeorm/entities/Customer';

@injectable()
class UpdateCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({
    id,
    name,
    email,
  }: IUpdateCustomer): Promise<Customer> {
    const customer = await this.customersRepository.findById(id);

    if (!customer) {
      throw new AppError('Customer not found.');
    }

    if (email) {
      const customerExists = await this.customersRepository.findByEmail(email);
      if (customerExists && email !== customer.email) {
        throw new AppError('There is already one customer with this email.');
      }
    }
    customer.name = name ? name : customer.name;
    customer.email = email ? email : customer.email;

    //const redisCache = new RedisCache();

    await redisCache.invalidate('api-vendas-CUSTOMER_LIST');

    await this.customersRepository.save(customer);

    return customer;
  }
}

export default UpdateCustomerService;
