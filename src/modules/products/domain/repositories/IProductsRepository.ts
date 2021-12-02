import { ICreateProduct } from '../models/ICreateProduct';
import { IFindProduct } from '../models/IFindProduct';
import { IProduct } from '../models/IProduct';
import { IUpdateProduct } from '../models/IUpdateProduct';
import { IUpdateStockProduct } from '../models/IUpdateStockProduct';
import { IProductPaginate } from '../models/IProductPaginate';

export interface IProductsRepository {
  create(data: ICreateProduct): Promise<IProduct>;
  save(product: IUpdateProduct): Promise<IProduct>;
  remove(product: IProduct): Promise<void>;
  updateStock(products: IUpdateStockProduct[]): Promise<IProduct[]>;
  findAll(): Promise<IProduct[]>;
  findById(id: string): Promise<IProduct | undefined>;
  findByName(name: string): Promise<IProduct | undefined>;
  findAllByIds(products: IFindProduct[]): Promise<IProduct[]>;
  findAllPaginate(): Promise<IProductPaginate>;
}
