import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import { isAfter, addHours } from 'date-fns';
import UsersRepository from '../typeorm/repositories/UsersRepository';
import UserTokensRepository from '../typeorm/repositories/UserTokensRepository';

interface IRequest {
  token: string;
  password: string;
}

class ResetPasswordService {
  public async execute({ token, password }: IRequest): Promise<void> {
    const userRepository = getCustomRepository(UsersRepository);
    const userTokenRepository = getCustomRepository(UserTokensRepository);

    //Verificando se o token existe
    const userToken = await userTokenRepository.findByToken(token);
    if (!userToken) {
      throw new AppError('User Token does not exists.');
    }
    //Verificando se o usuário existe
    const user = await userRepository.findById(userToken.user_id);
    if (!user) {
      throw new AppError('User does not exist.');
    }
    //Verificando se o token ainda está np prazo de validade (2 horas) usando 'date-fns' para
    const tokenCreatedAt = userToken.created_at;
    //Adiciona mais duas horas na data de criação do token
    const compareDate = addHours(tokenCreatedAt, 2);
    //Verifica se compareDate está após a hora atual
    if (isAfter(Date.now(), compareDate)) {
      throw new AppError('Token expered.');
    }
    user.password = await hash(password, 8);
    await userRepository.save(user);
  }
}

export default ResetPasswordService;
