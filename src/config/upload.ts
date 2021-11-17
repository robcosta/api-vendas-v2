import path from 'path';
import multer, { Multer } from 'multer';
import crypto from 'crypto';

interface IUploadConfig {
  driver: 's3' | 'disk';
  tmpFolder: string;
  directory: string;
  multer: Multer;
  config: {
    aws: {
      bucket: string;
    };
  };
}

const uploadFolder = path.resolve(__dirname, '..', '..', 'uploads');

const tmpFolder = path.resolve(__dirname, '..', '..', 'temp');

//Middleware para salvar a imagem enviada pelo usuário na pasta tmp
const uploadMulter = multer({
  storage: multer.diskStorage({
    destination: tmpFolder,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(6).toString('hex');
      const filename = `${fileHash + Date.now()}.${
        file.mimetype.split('/')[1]
      }`;
      callback(null, filename);
    },
  }),
  fileFilter: (request, file, callback) => {
    const imagesTypes: string[] = ['image/png', 'image/jpg', 'image/jpeg'];
    //Verifica se o arquivo a ser enviado é uma imagem válida
    callback(null, imagesTypes.includes(file.mimetype));
  },
  //limits: { fileSize: 2000000 },
});

export default {
  driver: process.env.STORAGE_DRIVER,
  directory: uploadFolder,
  tmpFolder,
  multer: uploadMulter,
  config: {
    aws: {
      bucket: process.env.BUCKET_S3,
    },
  },
} as IUploadConfig;
