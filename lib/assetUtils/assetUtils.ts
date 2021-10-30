import { ASSETS_DIST, IMAGE_FALLBACK } from 'config/common';
import Formidable from 'formidable';
import { AssetModel } from 'db/dbModels';
import { alwaysArray } from 'lib/arrayUtils';
import mkdirp from 'mkdirp';
import extName from 'ext-name';
import rimraf from 'rimraf';
import { FormatEnum } from 'sharp';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { promisify } from 'util';
const readFile = promisify(fs.readFile);

export interface StoreUploadsInterface {
  files: Formidable.Files;
  dist: string;
  dirName: string;
  startIndex?: number;
  format?: keyof FormatEnum;
  width?: number;
  height?: number;
}

export async function storeUploads({
  files,
  dist,
  startIndex = 0,
  dirName,
  format = 'webp',
  width,
}: StoreUploadsInterface): Promise<AssetModel[] | null> {
  try {
    const filesPath = path.join(process.cwd(), `public${ASSETS_DIST}`, dist, dirName);
    const assetsPath = `${dist}`;

    // Create directory if not exists
    await mkdirp(filesPath);

    const initialFiles: Formidable.File[] = [];
    Object.keys(files).forEach((key) => {
      alwaysArray(files[key]).forEach((file) => {
        initialFiles.push(file);
      });
    });

    const assets: AssetModel[] = [];
    for await (const [index, file] of initialFiles.entries()) {
      const fileName = new Date().getTime();
      const fileTypeResult = extName(file.name);
      const fileType = alwaysArray(fileTypeResult)[0];

      if (!fileType || !fileType.ext) {
        continue;
      }

      // get file buffer
      const buffer = await readFile(file.path);

      // save as svg if file type is svg
      if (fileType.ext === `svg`) {
        await fs.writeFile(`${filesPath}/${fileName}.svg`, buffer, (error) => {
          if (error) {
            console.log(error);
            return;
          }

          assets.push({
            url: `${assetsPath}/${fileName}.svg`,
            index: startIndex + index,
          });
        });
        continue;
      }

      // Save file to the FS
      const fileFullName = `${fileName}.${format}`;
      const transform = sharp(buffer);
      await transform.toFormat(format);
      if (width) {
        transform.resize(width);
      }
      await transform.toFile(`${filesPath}/${fileFullName}`);

      assets.push({
        url: `${ASSETS_DIST}/${dist}/${dirName}/${fileFullName}`,
        index: startIndex + index,
      });
    }
    return assets;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export const deleteUpload = async (filePath: string): Promise<boolean> => {
  if (filePath === IMAGE_FALLBACK) {
    return true;
  }
  const pathParts = filePath.split('/');
  const pathWithoutFile = pathParts.slice(0, pathParts.length - 1);
  const dirPath = pathWithoutFile.join('/');
  const deletePath = path.join(process.cwd(), `public`, dirPath);

  return new Promise((resolve) => {
    rimraf(deletePath, (e: any) => {
      if (e) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};

export interface ReorderAssetsInterface {
  initialAssets: AssetModel[];
  assetNewIndex: number;
  assetUrl: string;
}

export const reorderAssets = ({
  assetNewIndex,
  assetUrl,
  initialAssets,
}: ReorderAssetsInterface): AssetModel[] | null => {
  const sortedAssets = initialAssets.sort((assetA, assetB) => {
    return assetA.index - assetB.index;
  });
  const assetsWithUpdatedIndexes: AssetModel[] = sortedAssets.map(({ url }, index) => {
    return {
      url,
      index,
    };
  });

  const currentAsset = assetsWithUpdatedIndexes.find(({ url }) => url === assetUrl);

  if (!currentAsset) {
    return null;
  }

  const reorderedAssets = [...assetsWithUpdatedIndexes];
  const [removed] = reorderedAssets.splice(currentAsset.index, 1);
  reorderedAssets.splice(assetNewIndex, 0, removed);

  const reorderedAssetsWithUpdatedIndexes: AssetModel[] = reorderedAssets.map(({ url }, index) => {
    return {
      url,
      index,
    };
  });

  return reorderedAssetsWithUpdatedIndexes;
};

export function getMainImage(assets: AssetModel[]): string {
  const sortedAssets = assets.sort((assetA, assetB) => {
    return assetA.index - assetB.index;
  });
  const firstAsset = sortedAssets[0];
  let mainImage = IMAGE_FALLBACK;

  if (firstAsset) {
    mainImage = firstAsset.url;
  }
  return mainImage;
}
