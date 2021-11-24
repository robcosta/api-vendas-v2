import { ICreateProduct } from '../models/ICreateProduct';
import { IProductId } from '../models/IProductId';
import { IListProduct } from '../models/IListProduct';
import { IProduct } from '../models/IProduct';

export interface IProductsRepository {
  create(data: ICreateProduct): Promise<IProduct>;
  save(customer: IProduct): Promise<IProduct>;
  remove(customer: IProduct): Promise<void>;
  findAll(): Promise<IListProduct>;
  findById(id: string): Promise<IProduct | undefined>;
  findByName(name: string): Promise<IProduct | undefined>;
  findAllByIds(products: IProductId[]): Promise<IProduct[]>;
}
