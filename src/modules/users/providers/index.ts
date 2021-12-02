import { container } from 'tsyringe';
import BcriptHashProvider from './HashProvider/implementations/BcriptHashProvider';
import { IHashProvider } from './HashProvider/models/IHashProvider';

container.registerSingleton<IHashProvider>('HashProvider', BcriptHashProvider);
