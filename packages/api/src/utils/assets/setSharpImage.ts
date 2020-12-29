import sharp from 'sharp';
import fs from 'fs';
import mkdirp from 'mkdirp';
import path from 'path';

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
    const sourceImageFilePath = path.join(process.cwd(), sourceImage);

    const filesResolvePath = `/assets/${dist}/${slug}`;
    const fileName = `${slug}.${format}`;
    const resolvePath = `${filesResolvePath}/${fileName}`;

    const finalDirPath = path.join(process.cwd(), filesResolvePath);
    const finalPath = path.join(finalDirPath, fileName);

    const exists = fs.existsSync(finalPath);

    if (exists) {
      return resolvePath;
    }

    await mkdirp(finalDirPath);

    if (format === 'svg') {
      fs.copyFileSync(sourceImageFilePath, finalPath);
      return resolvePath;
    }

    let transform = sharp(sourceImageFilePath);

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
