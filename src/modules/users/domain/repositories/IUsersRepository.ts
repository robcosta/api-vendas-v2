import { ICreateUser } from '../models/ICreateUser';
import { IListUser } from '../models/IListUser';
import { IUser } from '../models/IUser';

export interface IUsersRepository {
  //create({ name, email, password, avatar }: ICreateUser): Promise<IUser>;
  create({ name, email, password }: ICreateUser): Promise<IUser>;
  save(user: IUser): Promise<IUser>;
  remove(user: IUser): Promise<void>;
  findAll(): Promise<IListUser>;
  findByName(name: string): Promise<IUser | undefined>;
  findById(id: string): Promise<IUser | undefined>;
  findByEmail(email: string): Promise<IUser | undefined>;
}
