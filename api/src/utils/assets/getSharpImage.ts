import fs from 'fs';
import sharp from 'sharp';

interface GetSharpImageInterface {
  path: string;
  format?: string;
  width?: number;
  height?: number;
}

export function getSharpImage({ path, format, width, height }: GetSharpImageInterface) {
  try {
    const filePath = `.${path}`;

    const exists = fs.existsSync(filePath);
    if (!exists) {
      return null;
    }

    const readStream = fs.createReadStream(filePath);
    let transform = sharp();

    if (format) {
      transform = transform.toFormat(format);
    }

    if (width || height) {
      transform = transform.resize(width, height);
    }

    return readStream.pipe(transform);
  } catch (e) {
    console.log('getSharpImage ERROR==== ', e);
    return null;
  }
}
