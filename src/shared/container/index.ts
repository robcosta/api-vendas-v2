import { container } from 'tsyringe';

import { ICustomersRepository } from '@modules/customers/domain/repositories/ICustomersRepository';
import CustomersRepository from '@modules/customers/infra/typeorm/repositories/CustomersRepository';

import { IProductsRepository } from '@modules/products/domain/repositories/IProductsRepository';
import ProductsRepository from '@modules/products/infra/typeorm/repositories/ProductsRepository';

import { IUsersRepository } from '@modules/users/domain/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

import { IUserTokensRepository } from '@modules/users/domain/repositories/IUserTokensRepository';
import UserTokensRepository from '@modules/users/infra/typeorm/repositories/UserTokensRepository';

import OrdersRepository from '@modules/orders/infra/typeorm/repositories/OrdersRepository';
import { IOrdersRepository } from '@modules/orders/domain/repositories/IOrdersRepository';

import '@modules/users/providers';

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

//Users
container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

//UserToken
container.registerSingleton<IUserTokensRepository>(
  'UserTokensRepository',
  UserTokensRepository,
);

//Orders
container.registerSingleton<IOrdersRepository>(
  'OrdersRepository',
  OrdersRepository,
);
