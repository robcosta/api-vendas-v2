import AppError from '@shared/errors/AppError';
import { hash } from 'bcryptjs';
import { isAfter, addHours } from 'date-fns';
import { IResetPasswordService } from '../domain/models/IResetPasswordService';
import { inject, injectable } from 'tsyringe';
import { IUsersRepository } from '../domain/repositories/IUsersRepository';
import { IUserTokensRepository } from '../domain/repositories/IUserTokensRepository';

@injectable()
class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
  ) {}

  public async execute({
    token,
    password,
  }: IResetPasswordService): Promise<void> {
    //Verificando se o token existe
    const userToken = await this.userTokensRepository.findByToken(token);
    if (!userToken) {
      throw new AppError('User Token does not exists.');
    }
    //Verificando se o usuário existe
    const user = await this.usersRepository.findById(userToken.user_id);
    if (!user) {
      throw new AppError('User does not exist.');
    }
    //Verificando se o token ainda está np prazo de validade (2 horas após sau criação) usando 'date-fns' para
    const tokenCreatedAt = userToken.created_at;
    //Adiciona mais duas horas na data de criação do token
    const compareDate = addHours(tokenCreatedAt, 2);
    //Verifica se compareDate está após a hora atual
    if (isAfter(Date.now(), compareDate)) {
      throw new AppError('Token expered.');
    }
    user.password = await hash(password, 8);
    await this.usersRepository.save(user);
  }
}

export default ResetPasswordService;
