import fs from 'fs';
import mkdirp from 'mkdirp';
import sharp from 'sharp';
import { Asset } from '../../entities/Asset';

export interface GenerateTestAssetsInterface {
  targetFileName: string;
  dist: string;
  slug: string;
  assetIndex?: number;
}

async function generateTestAsset({
  targetFileName,
  dist,
  slug,
  assetIndex = 0,
}: GenerateTestAssetsInterface): Promise<Asset> {
  try {
    const initialFilePath = `./src/test/${targetFileName}.png`;
    const filesPath = `./assets/${dist}/${slug}`;
    const filesResolvePath = `/assets/${dist}/${slug}`;
    const fileName = `${slug}-${assetIndex}`;
    const fileFormat = 'webp';
    const resolvePath = `${filesResolvePath}/${fileName}.${fileFormat}`;
    const finalPath = `${filesPath}/${fileName}.${fileFormat}`;

    const resolveAsset = {
      index: assetIndex,
      url: resolvePath,
    };

    const exists = fs.existsSync(filesPath);
    if (!exists) {
      await mkdirp(filesPath);
    } else {
      return resolveAsset;
    }

    return new Promise<Asset>((resolve, reject) => {
      sharp(initialFilePath)
        .webp()
        .toFile(finalPath)
        .then(() => {
          resolve(resolveAsset);
        })
        .catch((error) => {
          reject(error);
        });
    });
  } catch (e) {
    console.log('=== Error in generateTestAssets=== \n');
    console.log(e);
    return {
      index: assetIndex,
      url: 'errorPath',
    };
  }
}

export default generateTestAsset;
