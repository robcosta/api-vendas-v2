import { ICustomer } from '../models/ICustomer';
import { ICreateCustomer } from '../models/ICreateCustomer';
import { IListCustomer } from '../models/IListCustomer';

export interface ICustomersRepository {
  create(data: ICreateCustomer): Promise<ICustomer>;
  save(customer: ICustomer): Promise<ICustomer>;
  remove(customer: ICustomer): Promise<void>;
  findByName(name: string): Promise<ICustomer | undefined>;
  findById(id: string): Promise<ICustomer | undefined>;
  findByEmail(email: string): Promise<ICustomer | undefined>;
  findAll(): Promise<IListCustomer>;
}
