import path from 'path';
import multer from 'multer';
import crypto from 'crypto';
import sharp from 'sharp';
import fs from 'fs';

export const uploadFolder = path.resolve(__dirname, '..', '..', 'uploads');

export const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

//Salva a imagem enviada pelo usuário na pasta tmp
export const uploadMulter = multer({
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

//Reduz o tamanho da imagem que está na psta 'tmp' e salva na pasta 'upload'
export async function resizeImage(avatarFilename: string): Promise<void> {
  const imageSize = 500;
  await sharp(path.join(tmpFolder, avatarFilename))
    .resize(imageSize)
    .toFormat('jpeg')
    .toFile(path.join(uploadFolder, avatarFilename));

  //Apaga a imagem da pasta 'tmp'
  fs.unlinkSync(path.join(tmpFolder, avatarFilename));

  return;
}
