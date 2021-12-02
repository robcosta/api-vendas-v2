import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { IOrdersRepository } from '../domain/repositories/IOrdersRepository';
import { ICustomersRepository } from '@modules/customers/domain/repositories/ICustomersRepository';
import { IProductsRepository } from '@modules/products/domain/repositories/IProductsRepository';
import { IOrder } from '../domain/models/IOrder';
import { IRequestCreateOrder } from '../domain/models/IRequestCreateOrder';
import UpdateProductService from '@modules/products/services/UpdateProductService';

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}
  public async execute({
    customer_id,
    products,
  }: IRequestCreateOrder): Promise<IOrder> {
    const customerExists = await this.customersRepository.findById(customer_id);

    if (!customerExists) {
      throw new AppError('Could not find any customer with the given id.');
    }

    const existsProducts = await this.productsRepository.findAllByIds(products);

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

    // const transactionOrder = await getConnection().transaction(
    //   async transactionalEntityManager => {
    const order = await this.ordersRepository.create({
      customer: customerExists,
      products: serializedProducts,
    });

    //Atualizando as quantidades dos produtos na tabela produtos
    const { order_products } = order;

    const updatedProductsQauntity = order_products.map(product => ({
      id: product.product_id,
      quantity:
        existsProducts.filter(p => p.id === product.product_id)[0].quantity -
        product.quantity,
      name: undefined,
      price: undefined,
    }));

    const updateProduct = new UpdateProductService(this.productsRepository);
    updatedProductsQauntity.map(async product => {
      const name = undefined;
      const price = undefined;
      const id = product.id;
      const quantity = product.quantity;
      await updateProduct.execute({ id, name, price, quantity });
    });

    // await this.productsRepository.updateStock(updatedProductsQauntity);

    // await transactionalEntityManager.save(order);

    // products.map(
    //   async product => await transactionalEntityManager.save(product),
    // );

    return order;
    //   },
    // );

    // return transactionOrder;
  }
}

export default CreateOrderService;
