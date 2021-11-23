import AppError from '@shared/errors/AppError';
import { getCustomRepository, getConnection } from 'typeorm';
import Order from '../infra/typeorm/entities/Order';
import OrdersRepository from '@modules/orders/infra/typeorm/repositories/OrdersRepository';
import CustomersRepository from '@modules/customers/infra/typeorm/repositories/CustomersRepository';
import ProductRepository from '@modules/products/infra/typeorm/repositories/ProductsRepository';

interface IProduct {
  id: string;
  price: number;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

class CreateOrderService {
  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const ordersRepository = getCustomRepository(OrdersRepository);
    const customersRepository = getCustomRepository(CustomersRepository);
    const productsRepository = getCustomRepository(ProductRepository);

    const customerExists = await customersRepository.findById(customer_id);
    if (!customerExists) {
      throw new AppError('Could not find any customer with the given id.');
    }

    const existsProducts = await productsRepository.findAllByIds(products);

    if (!existsProducts.length) {
      throw new AppError('Could not find any products with the given ids.');
    }

    const existsProductsIds = existsProducts.map(product => product.id);

    const checkInexistentProducts = products.filter(
      product => !existsProductsIds.includes(product.id),
    );

    if (checkInexistentProducts.length) {
      throw new AppError(
        `Could not find any product ${checkInexistentProducts[0].id}.`,
      );
    }

    const quantityAvailable = products.filter(
      product =>
        existsProducts.filter(p => p.id === product.id)[0].quantity <
        product.quantity,
    );

    if (quantityAvailable.length) {
      throw new AppError(
        `The quantity ${quantityAvailable[0].quantity} is not available for ${quantityAvailable[0].id}`,
      );
    }

    const serializedProducts = products.map(product => ({
      product_id: product.id,
      quantity: product.quantity,
      price: existsProducts.filter(p => p.id === product.id)[0].price,
    }));

    const transactionOrder = await getConnection().transaction(async () => {
      const order = await ordersRepository.createOrder({
        customer: customerExists,
        products: serializedProducts,
      });

      //Ataulizando as quantidades dos produtos na tabela produtos
      const { order_products } = order;

      const updatedProductQauntity = order_products.map(product => ({
        id: product.product_id,
        quantity:
          existsProducts.filter(p => p.id === product.product_id)[0].quantity -
          product.quantity,
      }));

      await productsRepository.save(updatedProductQauntity);

      return order;
    });

    return transactionOrder;
  }
}

export default CreateOrderService;
