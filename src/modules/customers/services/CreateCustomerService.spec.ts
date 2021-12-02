import 'reflect-metadata';
import CreateCustomerService from './CreateCustomerService';
import FakeCustomersRepository from '@modules/customers/domain/repositories/fakes/FakeCustomersRepository';
import AppError from '@shared/errors/AppError';

let fakeCustomersRepository: FakeCustomersRepository;
let createCustomer: CreateCustomerService;

describe('CreateCustomer', () => {
  beforeEach(() => {
    fakeCustomersRepository = new FakeCustomersRepository();
    createCustomer = new CreateCustomerService(fakeCustomersRepository);
  });

  it('should be able to create a new customer', async () => {
    const customer = await createCustomer.execute({
      name: 'Roberto Costa',
      email: 'roberto@gmail.com',
    });

    expect(customer).toHaveProperty('id');
  });

  it('should not be able to create two customeres with the same email', async () => {
    await createCustomer.execute({
      name: 'Roberto Costa',
      email: 'roberto@gmail.com',
    });

    expect(
      createCustomer.execute({
        name: 'João Nascimento',
        email: 'roberto@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
