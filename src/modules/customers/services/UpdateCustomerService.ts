import redisCache from '@shared/cache/RedisCache';
import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import Customer from '../typeorm/entities/Customer';
import CustomersRepository from '../typeorm/repositories/CustomersRepository';

interface IRequest {
  id: string;
  name?: string;
  email?: string;
}

class UpdateCustomerService {
  public async execute({ id, name, email }: IRequest): Promise<Customer> {
    const customerRepository = getCustomRepository(CustomersRepository);
    const customer = await customerRepository.findById(id);

    if (!customer) {
      throw new AppError('Customer not found.');
    }

    if (email) {
      const customerExists = await customerRepository.findByEmail(email);
      if (customerExists && email !== customer.email) {
        throw new AppError('There is already one customer with this email.');
      }
    }
    customer.name = name ? name : customer.name;
    customer.email = email ? email : customer.email;

    //const redisCache = new RedisCache();

    await redisCache.invalidate('api-vendas-CUSTOMER_LIST');

    await customerRepository.save(customer);

    return customer;
  }
}

export default UpdateCustomerService;
