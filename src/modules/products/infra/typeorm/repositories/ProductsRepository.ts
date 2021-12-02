import { Repository, In, getRepository } from 'typeorm';
import { IProductsRepository } from '@modules/products/domain/repositories/IProductsRepository';
import Product from '../entities/Product';
import { ICreateProduct } from '@modules/products/domain/models/ICreateProduct';
import { IUpdateStockProduct } from '@modules/products/domain/models/IUpdateStockProduct';
import { IProductPaginate } from '@modules/products/domain/models/IProductPaginate';
import { IFindProduct } from '@modules/products/domain/models/IFindProduct';
import redisCache from '@shared/cache/RedisCache';

class ProductRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;
  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProduct): Promise<Product> {
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

  public async updateStock(
    products: IUpdateStockProduct[],
  ): Promise<Product[]> {
    await redisCache.invalidate('api-vendas-PRODUCT_LIST');
    const productsUpdate = await this.ormRepository.save(products);
    return productsUpdate;
  }

  public async findAll(): Promise<Product[]> {
    const products = await this.ormRepository.find();
    return products;
  }

  public async findAllPaginate(): Promise<IProductPaginate> {
    const products = await this.ormRepository.createQueryBuilder().paginate();
    return products as IProductPaginate;
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

  public async findAllByIds(products: IFindProduct[]): Promise<Product[]> {
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
