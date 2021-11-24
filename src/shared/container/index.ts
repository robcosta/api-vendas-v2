import { container } from 'tsyringe';

import { ICustomersRepository } from '@modules/customers/domain/repositories/ICustomersRepository';
import CustomersRepository from '@modules/customers/infra/typeorm/repositories/CustomersRepository';

import { IProductsRepository } from '@modules/products/domain/repositories/IProductsRepository';
import ProductsRepository from '@modules/products/infra/typeorm/repositories/ProductsRepository';

//Customers
container.registerSingleton<ICustomersRepository>(
  'CustomersRepository',
  CustomersRepository,
);

//Products
container.registerSingleton<IProductsRepository>(
  'ProductsRepository',
  ProductsRepository,
);
