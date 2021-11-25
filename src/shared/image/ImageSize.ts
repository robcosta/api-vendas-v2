import path from 'path';
import sharp from 'sharp';
import uploadConfig from '@config/upload';

export default class ImageSize {
  private imageSize = Number(process.env.IMAGE_SIZE);

  public async resizeImage(file: string) {
    await sharp(path.join(uploadConfig.tmpFolder, file))
      .resize(this.imageSize)
      .toFormat('jpeg')
      .toFile(path.join(uploadConfig.directory, file));
    return file;
  }
}
