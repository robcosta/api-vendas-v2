import { ICreateCustomer } from '@modules/customers/domain/models/ICreateCustomer';
import { IListCustomer } from '@modules/customers/domain/models/IListCustomer';
import { ICustomersRepository } from '@modules/customers/domain/repositories/ICustomersRepository';
import Customer from '@modules/customers/infra/typeorm/entities/Customer';
import { v4 as uuidv4 } from 'uuid';

//class FakeCustomersRepository implements Omit<ICustomersRepository, 'remove' | 'findAll' {

class FakeCustomersRepository implements ICustomersRepository {
  private customers: Customer[] = [];

  public async create({ name, email }: ICreateCustomer): Promise<Customer> {
    const customer = new Customer();

    customer.id = uuidv4();
    customer.name = name;
    customer.email = email;

    this.customers.push(customer);

    return customer;
  }

  public async save(customer: Customer): Promise<Customer> {
    const findIndex = this.customers.findIndex(
      findCustomer => findCustomer.id === customer.id,
    );

    this.customers[findIndex] = customer;

    return customer;
  }

  public async remove(customer: Customer): Promise<void> {
    const index = this.customers.indexOf(customer);
    if (index > -1) {
      this.customers.splice(index, 1);
    }
  }

  public async findByName(name: string): Promise<Customer | undefined> {
    const customer = this.customers.find(customer => customer.name === name);
    return customer;
  }

  public async findById(id: string): Promise<Customer | undefined> {
    const customer = this.customers.find(customer => customer.id === id);
    return customer;
  }

  public async findByEmail(email: string): Promise<Customer | undefined> {
    const customer = this.customers.find(customer => customer.email === email);
    return customer;
  }

  public async findAll(): Promise<IListCustomer> {
    const listCustomer = {
      from: 1,
      to: 1,
      per_page: 1,
      total: this.customers.length,
      current_page: 1,
      prev_page: null,
      next_page: null,
      last_page: 1,
      data: this.customers,
    };

    return listCustomer;
  }
}

export default FakeCustomersRepository;
