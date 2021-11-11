interface IMAilConfig {
  driver: 'mailtrap' | 'ses';
  defaults: {
    from: {
      email: string;
      name: string;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER || 'mailtrap',
  defaults: {
    from: {
      email: 'roberto.costa@lblbiju.com.br',
      name: 'Roberto Costa',
    },
  },
} as unknown as IMAilConfig;
