import AppError from '@shared/errors/AppError';
import path from 'path';
import fs from 'fs';
import { getCustomRepository } from 'typeorm';
import User from '../typeorm/entities/User';
import UsersRepository from '../typeorm/repositories/UsersRepository';
import { uploadFolder, resizeImage } from '@config/upload';

interface IRequest {
  user_id: string;
  avatarFilename: string | undefined;
}

class UpdateUserAvatarService {
  public async execute({
    user_id,
    avatarFilename,
  }: IRequest): Promise<User | undefined> {
    const usersRepository = getCustomRepository(UsersRepository);
    const user = await usersRepository.findById(user_id);
    if (!user) {
      throw new AppError('User not found.');
    }
    //Verifica se foi enviado algum arquivo de imagem
    if (!avatarFilename) {
      if (user.avatar !== 'defaultAvatar.png' && user.avatar) {
        const userAvatarFilePath = path.join(uploadFolder, user.avatar);
        const userAvatarFileExists = fs.existsSync(userAvatarFilePath);
        if (userAvatarFileExists) {
          await fs.promises.unlink(userAvatarFilePath);
        }
      }
      user.avatar = 'defaultAvatar.png';
      await usersRepository.save(user);
      throw new AppError('Image not send.');
    }

    await resizeImage(avatarFilename);
    //console.log('USER:', user);

    if (user.avatar !== 'defaultAvatar.png' && user.avatar) {
      const userAvatarFilePath = path.join(uploadFolder, user.avatar);
      const userAvatarFileExists = fs.existsSync(userAvatarFilePath);
      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    user.avatar = avatarFilename;
    await usersRepository.save(user);
    return user;
  }
}

export default UpdateUserAvatarService;
