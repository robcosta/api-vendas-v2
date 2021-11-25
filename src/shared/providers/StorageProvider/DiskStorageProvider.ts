import uploadConfig from '@config/upload';
import ImageSize from '@shared/image/imageSize';
import fs from 'fs';
import path from 'path';

export default class DiskStorageProvider {
  public async saveFile(file: string): Promise<string> {
    const image = new ImageSize().resizeImage(file);
    return image;
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
