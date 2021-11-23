import AppError from '@shared/errors/AppError';
import { hash, compare } from 'bcryptjs';
import { getCustomRepository } from 'typeorm';
import User from '../infra/typeorm/entities/User';
import UsersRepository from '../infra/typeorm/repositories/UsersRepository';

interface IRequest {
  user_id: string;
  name?: string;
  email?: string;
  password?: string;
  old_password?: string;
}

class UpdateProfileService {
  public async execute({
    user_id,
    name,
    email,
    password,
    old_password,
  }: IRequest): Promise<User> {
    const usersRepository = getCustomRepository(UsersRepository);

    const user = await usersRepository.findById(user_id);

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
      const userUpdateEmail = await usersRepository.findByEmail(email);
      if (userUpdateEmail && userUpdateEmail.id !== user.id) {
        throw new AppError('There is already one user with email.');
      }
    }

    const hashedPassword = password ? await hash(password, 8) : user.password;

    user.name = name ? name : user.name;
    user.email = email ? email : user.email;
    user.password = password ? hashedPassword : user.password;

    await usersRepository.save(user);

    return user;
  }
}

export default UpdateProfileService;
