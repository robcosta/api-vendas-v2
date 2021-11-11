import uploadConfig from '@config/upload';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export default class DiskStorageProvider {
  public async saveFile(file: string): Promise<string> {
    const imageSize = Number(process.env.IMAGE_SIZE);
    await sharp(path.join(uploadConfig.tmpFolder, file))
      .resize(imageSize)
      .toFormat('jpeg')
      .toFile(path.join(uploadConfig.directory, file));

    return file;
  }

  public async deleteFile(
    file: string,
    filePath: 'directory' | 'tmpFolder',
  ): Promise<void> {
    const delFilePath =
      filePath === 'tmpFolder'
        ? path.resolve(uploadConfig.tmpFolder, file)
        : path.resolve(uploadConfig.directory, file);

    try {
      await fs.promises.stat(delFilePath);
    } catch {
      return;
    }
    await fs.promises.unlink(delFilePath);
  }
}
