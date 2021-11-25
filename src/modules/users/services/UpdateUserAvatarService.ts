import AppError from '@shared/errors/AppError';
import uploadConfig from '@config/upload';
import DiskStorageProvider from '@shared/providers/StorageProvider/DiskStorageProvider';
import S3StorageProvider from '@shared/providers/StorageProvider/S3StorageProvider';
import { IUpdateAvatar } from '../domain/models/IUpdateAvatar';
import { IUser } from '../domain/models/IUser';
import { inject, injectable } from 'tsyringe';
import { IUsersRepository } from '../domain/repositories/IUsersRepository';

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}
  public async execute({
    user_id,
    avatarFilename,
  }: IUpdateAvatar): Promise<IUser | undefined> {
    // Verifica se o usuário existe
    const user = await this.usersRepository.findById(user_id);
    if (!user) {
      throw new AppError('User not found.');
    }

    let storageProvider = new DiskStorageProvider();

    // Verifica o local de armazenamento é na nuvem (Amazon S3)
    if (uploadConfig.driver === 's3') {
      storageProvider = new S3StorageProvider();
    }

    //Verifica se foi enviado algum arquivo de imagem
    if (!avatarFilename) {
      if (user.avatar !== 'defaultAvatar.png') {
        await storageProvider.deleteFile(user.avatar, 'directory');
      }
      user.avatar = 'defaultAvatar.png';
      await this.usersRepository.save(user);
      throw new AppError('Image not send.');
    }

    await storageProvider.deleteFile(user.avatar, 'directory');
    await storageProvider.saveFile(avatarFilename);
    await storageProvider.deleteFile(avatarFilename, 'tmpFolder');

    user.avatar = avatarFilename;
    await this.usersRepository.save(user);
    return user;
  }
}

export default UpdateUserAvatarService;
