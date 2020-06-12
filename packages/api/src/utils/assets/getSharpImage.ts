import fs from 'fs';
import sharp from 'sharp';

interface GetSharpImageInterface {
  path: string;
  format?: string;
  width?: number;
  height?: number;
}

export function getSharpImage({ path, format, width, height }: GetSharpImageInterface) {
  const readStream = fs.createReadStream(`.${path}`);
  let transform = sharp();

  if (format) {
    transform = transform.toFormat(format);
  }

  if (width || height) {
    transform = transform.resize(width, height);
  }

  return readStream.pipe(transform);
}
