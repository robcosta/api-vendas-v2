import redisCache from '@shared/cache/RedisCache';
import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import Customer from '../infra/typeorm/entities/Customer';
import CustomersRepository from '../infra/typeorm/repositories/CustomersRepository';

interface IRequest {
  name: string;
  email: string;
}

class CreateCustomerService {
  public async execute({ name, email }: IRequest): Promise<Customer> {
    const customersRepository = getCustomRepository(CustomersRepository);
    const emailExist = await customersRepository.findByEmail(email);

    if (emailExist) {
      throw new AppError('Email address already used.');
    }

    // const redisCache = new RedisCache();

    const customer = customersRepository.create({ name, email });

    await redisCache.invalidate('api-vendas-CUSTOMER_LIST');

    await customersRepository.save(customer);

    return customer;
  }
}

export default CreateCustomerService;
