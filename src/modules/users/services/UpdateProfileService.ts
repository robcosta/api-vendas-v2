import AppError from '@shared/errors/AppError';
import { hash, compare } from 'bcryptjs';
import { inject, injectable } from 'tsyringe';
import { IUpdateProfile } from '../domain/models/IUpdateProfile';
import { IUser } from '../domain/models/IUser';
import { IUsersRepository } from '../domain/repositories/IUsersRepository';

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}
  public async execute({
    user_id,
    name,
    email,
    password,
    old_password,
  }: IUpdateProfile): Promise<IUser> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found.');
    }
    if (password && !old_password) {
      throw new AppError('Old password is required.');
    }
    if (password && old_password) {
      const checkOldpassword = await compare(old_password, user.password);
      if (!checkOldpassword) {
        throw new AppError('Old password does not match.');
      }
    }
    if (email) {
      const userUpdateEmail = await this.usersRepository.findByEmail(email);
      if (userUpdateEmail && userUpdateEmail.id !== user.id) {
        throw new AppError('There is already one user with email.');
      }
    }

    const hashedPassword = password ? await hash(password, 8) : user.password;

    user.name = name ? name : user.name;
    user.email = email ? email : user.email;
    user.password = password ? hashedPassword : user.password;

    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateProfileService;
