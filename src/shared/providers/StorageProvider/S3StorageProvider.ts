import uploadConfig from '@config/upload';
import fs from 'fs';
import path from 'path';
//import sharp from 'sharp';
import aws, { S3 } from 'aws-sdk';
import mime from 'mime';
import ImageSize from '@shared/image/imageSize';

export default class S3StorageProvider {
  private client: S3;

  constructor() {
    this.client = new aws.S3({
      region: 'us-east-1',
    });
  }

  public async saveFile(file: string): Promise<string> {
    new ImageSize().resizeImage(file);
    // const imageSize = Number(process.env.IMAGE_SIZE);
    // await sharp(path.join(uploadConfig.tmpFolder, file))
    //   .resize(imageSize)
    //   .toFormat('jpeg')
    //   .toFile(path.join(uploadConfig.directory, file));

    const tmpPath = path.resolve(uploadConfig.tmpFolder, file);

    const originalPath = path.resolve(uploadConfig.directory, file);

    const ContentType = mime.getType(originalPath);

    if (!ContentType) {
      throw new Error('File not found.');
    }

    const fileContent = await fs.promises.readFile(originalPath);

    await this.client
      .putObject({
        Bucket: uploadConfig.config.aws.bucket,
        Key: file,
        ACL: 'public-read',
        Body: fileContent,
        ContentType,
      })
      .promise();

    await fs.promises.unlink(tmpPath);
    await fs.promises.unlink(originalPath);

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    await this.client
      .deleteObject({
        Bucket: uploadConfig.config.aws.bucket,
        Key: file,
      })
      .promise();
  }
}
