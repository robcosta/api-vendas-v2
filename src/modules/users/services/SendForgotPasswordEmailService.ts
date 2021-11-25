import AppError from '@shared/errors/AppError';
import path from 'path';
import mailConfig from '@config/mail/mail';
//import EtherealMail from '@config/mail/EtherealMail';
import MailTrap from '@config/mail/MailtrapMail'; //Ambiente dev
import SESMail from '@config/mail/SESMail'; // Ambiente Prod
import { inject, injectable } from 'tsyringe';
import { IUsersRepository } from '../domain/repositories/IUsersRepository';
import { IUserTokensRepository } from '../domain/repositories/IUserTokensRepository';

interface IRequest {
  email: string;
}

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
  ) {}
  public async execute({ email }: IRequest): Promise<void> {
    //Verificando se o email existe
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new AppError('User does not exists.');
    }

    //Gerando o token do usuário
    const { token } = await this.userTokensRepository.generate(user.id);

    const forgotPasswordTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'forgot_password.hbs',
    );

    if (mailConfig.driver === 'ses') {
      await SESMail.sendMail({
        to: {
          name: user.name,
          email: user.email,
        },
        subject: '[API Vendas] Recuperação de Senha.',
        templateData: {
          file: forgotPasswordTemplate,
          variables: {
            name: user.name,
            link: `${process.env.APP_WEB_URL}/reset_password?token=${token}`,
          },
        },
      });
      console.log('Email, chegou aqui no SES mail');
      return;
    }

    await MailTrap.sendMail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: '[API Vendas] Recuperação de Senha.',
      templateData: {
        file: forgotPasswordTemplate,
        variables: {
          name: user.name,
          link: `${process.env.APP_WEB_URL}/reset_password?token=${token}`,
        },
      },
    });
  }
}

export default SendForgotPasswordEmailService;
