import sharp from 'sharp';
import fs from 'fs';
import mkdirp from 'mkdirp';

export type StoreFileFormat = 'jpg' | 'png' | 'svg' | 'webp';

interface SetSharpImageInterface {
  sourceImage: string;
  slug: string;
  dist: string;
  format: StoreFileFormat;
  width?: number;
  height?: number;
}

export async function setSharpImage({
  sourceImage,
  slug,
  dist,
  format,
  width,
  height,
}: SetSharpImageInterface): Promise<string | null> {
  try {
    const filesPath = `./assets/${dist}`;
    const filesResolvePath = `/assets/${dist}`;
    const fileName = `${slug}.${format}`;
    const resolvePath = `${filesResolvePath}/${fileName}`;
    const finalPath = `${filesPath}/${fileName}`;

    const exists = fs.existsSync(finalPath);

    if (exists) {
      return resolvePath;
    }

    await mkdirp(filesPath);

    let transform = sharp(sourceImage);

    /*if (format) {
      transform = transform.toFormat(format);
    }*/

    if (width || height) {
      transform = transform.resize(width, height);
    }

    await transform.toFile(finalPath);
    return resolvePath;
  } catch (e) {
    console.log(e);
    return null;
  }
}
