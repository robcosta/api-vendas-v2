import AppError from '@shared/errors/AppError';
import path from 'path';
import fs from 'fs';
import { getCustomRepository } from 'typeorm';
import User from '../typeorm/entities/User';
import UsersRepository from '../typeorm/repositories/UsersRepository';
//import { uploadFolder, resizeImage } from '@config/upload';
import DiskStorageProvider from '@shared/providers/StorageProvider/DiskStorageProvider';

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

    const storageProvider = new DiskStorageProvider();

    const user = await usersRepository.findById(user_id);
    if (!user) {
      throw new AppError('User not found.');
    }
    //Verifica se foi enviado algum arquivo de imagem
    if (!avatarFilename) {
      if (user.avatar !== 'defaultAvatar.png') {
        await storageProvider.deleteFile(user.avatar, 'directory');
      }
      user.avatar = 'defaultAvatar.png';
      await usersRepository.save(user);
      throw new AppError('Image not send.');
    }

    await storageProvider.deleteFile(user.avatar, 'directory');
    await storageProvider.saveFile(avatarFilename);
    await storageProvider.deleteFile(avatarFilename, 'tmpFolder');

    user.avatar = avatarFilename;
    await usersRepository.save(user);
    return user;
  }
}

export default UpdateUserAvatarService;
