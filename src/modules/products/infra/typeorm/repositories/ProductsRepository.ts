import { ICreateProduct } from '@modules/products/domain/models/ICreateProduct';
import { IProductsId } from '@modules/products/domain/models/IProductsId';
import { IListProduct } from '@modules/products/domain/models/IListProduct';
import { IProductsRepository } from '@modules/products/domain/repositories/IProductsRepository';
import { Repository, In, getRepository } from 'typeorm';
import Product from '../entities/Product';

class ProductRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;
  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({ name, price, quantity }: ICreateProduct) {
    const product = this.ormRepository.create({ name, price, quantity });
    await this.ormRepository.save(product);
    return product;
  }

  public async save(product: Product): Promise<Product> {
    await this.ormRepository.save(product);
    return product;
  }

  public async remove(product: Product): Promise<void> {
    await this.ormRepository.remove(product);
  }

  public async findAll(): Promise<IListProduct> {
    const customers = await this.ormRepository.createQueryBuilder().paginate();
    return customers as IListProduct;
  }

  public async findById(id: string): Promise<Product | undefined> {
    const product = await this.ormRepository.findOne(id);
    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const product = await this.ormRepository.findOne({
      where: { name },
    });
    return product;
  }

  public async findAllByIds(products: IProductsId[]): Promise<Product[]> {
    const productIds = products.map(product => product.id);

    const existentProducts = await this.ormRepository.find({
      where: {
        id: In(productIds),
      },
    });

    return existentProducts;
  }
}

export default ProductRepository;
