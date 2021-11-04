import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import Customer from '../typeorm/entities/Customer';
import CustomersRepository from '../typeorm/repositories/CustomersRepository';

interface IRequest {
  customer_id: string;
  name?: string;
  email?: string;
}

class UpdateCustomerService {
  public async execute({
    customer_id,
    name,
    email,
  }: IRequest): Promise<Customer> {
    const customerRepository = getCustomRepository(CustomersRepository);
    const customer = await customerRepository.findById(customer_id);

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

    await customerRepository.save(customer);

    return customer;
  }
}

export default UpdateCustomerService;
