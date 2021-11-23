import { ICustomer } from '../models/ICustomer';
import { ICreateCustomer } from '../models/ICreateCustomer';

export interface ICustomersRepository {
  // create(data: ICreateCustomer): Promise<ICustomer>;
  // save(customer: ICustomer): Promise<ICustomer>;
  findByName(name: string): Promise<ICustomer | undefined>;
  findById(id: string): Promise<ICustomer | undefined>;
  findByEmail(email: string): Promise<ICustomer | undefined>;
}
