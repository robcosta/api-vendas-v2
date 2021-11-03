import nodemailer from 'nodemailer';
import HandlebarsMailTemplate from './HandlebarsMailTemplate';

interface IMailContact {
  name: string;
  email: string;
}
interface ITemplateVariable {
  [key: string]: string | number;
}

interface IParseMailTemplate {
  file: string;
  variables: ITemplateVariable;
}

interface ISendMail {
  from?: IMailContact;
  to: IMailContact;
  subject: string;
  templateData: IParseMailTemplate;
}

export default class EtherealMail {
  static async sendMail({
    from,
    to,
    subject,
    templateData,
  }: ISendMail): Promise<void> {
    const mailTemplate = new HandlebarsMailTemplate();
    // console.log('Aqui chegou&&&&&, antes do nodemailer.createTestAccount()');
    const account = await nodemailer.createTestAccount();
    //console.log('ACCOUNT_NODEMAILER', account);

    const transporter = nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: account.user,
        pass: account.pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const message = await transporter.sendMail({
      from: {
        name: from?.name || 'Equipe API Vendas',
        address: from?.email || 'equipe@apivendas.com.br',
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: await mailTemplate.parse(templateData),
    });

    console.log('Message sent: %s', message.messageId);

    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
  }
}
