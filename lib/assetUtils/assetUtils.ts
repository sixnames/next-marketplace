import Formidable from 'formidable';
import mkdirp from 'mkdirp';
import extName from 'ext-name';
import rimraf from 'rimraf';
import sharp, {
  AvailableFormatInfo,
  AvifOptions,
  FormatEnum,
  GifOptions,
  HeifOptions,
  JpegOptions,
  OutputOptions,
  PngOptions,
  TiffOptions,
  WebpOptions,
} from 'sharp';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import {
  ASSETS_DIST,
  ASSETS_DIST_CONFIGS,
  ASSETS_DIST_CONFIGS_WATERMARK,
  ASSETS_DIST_PRODUCTS,
  IMAGE_FALLBACK,
  IMAGE_FALLBACK_BOTTLE,
} from '../../config/common';
import { AssetModel } from '../../db/dbModels';
import { alwaysArray } from '../arrayUtils';
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

export function checkIfWatermarkNeeded(filePath: string): boolean {
  const watermarkDirectories = [
    ASSETS_DIST_PRODUCTS,
    // ASSETS_DIST_BLOG,
    // ASSETS_DIST_BLOG_CONTENT,
    // ASSETS_DIST_PAGES,
    // ASSETS_DIST_SEO,
  ];
  const pathArr = filePath.split('/');
  const showWatermark = pathArr.some((pathPart) => {
    return watermarkDirectories.includes(pathPart);
  });

  return showWatermark;
}

interface GetSharpImageInterface {
  filePath: string;
  format?: keyof FormatEnum | AvailableFormatInfo;
  width?: number;
  quality?: number;
  showWatermark: boolean;
  companySlug: string;
}

export async function getSharpImage({
  filePath,
  format = 'webp',
  width,
  quality,
  showWatermark,
  companySlug,
}: GetSharpImageInterface) {
  try {
    const defaultImageQuality = 40;
    const dist = path.join(process.cwd(), filePath);

    const exists = fs.existsSync(dist);
    if (!exists) {
      return null;
    }

    let transform = sharp(dist);

    // set image size
    if (width) {
      transform = transform.resize(Math.round(width));
    }

    // set format and quality
    if (format) {
      let options:
        | undefined
        | OutputOptions
        | JpegOptions
        | PngOptions
        | WebpOptions
        | AvifOptions
        | HeifOptions
        | GifOptions
        | TiffOptions = undefined;
      if (showWatermark || quality) {
        options = {
          quality: quality || defaultImageQuality,
        };
      }
      transform = transform.toFormat(format, options);
    }

    // add watermark if needed
    if (showWatermark) {
      const watermarkPath = `${ASSETS_DIST}/${ASSETS_DIST_CONFIGS}/${companySlug}/${ASSETS_DIST_CONFIGS_WATERMARK}/${ASSETS_DIST_CONFIGS_WATERMARK}.png`;
      let watermarkDist = path.join(process.cwd(), watermarkPath);
      const exists = fs.existsSync(watermarkDist);
      if (!exists) {
        watermarkDist = path.join(process.cwd(), '/public/watermark.png');
      }

      const watermarkDefaultSize = 40;
      const watermarkSize = Math.round(width ? width / 10 : watermarkDefaultSize);
      const watermarkBuffer = await sharp(watermarkDist).resize(watermarkSize).toBuffer();
      transform.composite([
        {
          input: watermarkBuffer,
          tile: true,
          blend: 'atop',
        },
      ]);
    }

    return transform.toBuffer();
  } catch (e) {
    console.log('getSharpImage ERROR==== ', e);
    return null;
  }
}

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
    const assetsPath = `${ASSETS_DIST}/${dist}/${dirName}`;
    const filesPath = path.join(process.cwd(), assetsPath);

    // Create directory if not exists
    await mkdirp(filesPath);

    const initialFiles: Formidable.File[] = [];
    Object.keys(files).forEach((key) => {
      alwaysArray(files[key]).forEach((file) => {
        initialFiles.push(file);
      });
    });

    const filesPathArray = filesPath.split('/');
    const isWatermark = filesPathArray.includes(ASSETS_DIST_CONFIGS_WATERMARK);

    const assets: AssetModel[] = [];
    for await (const [index, file] of initialFiles.entries()) {
      const fileName = isWatermark ? ASSETS_DIST_CONFIGS_WATERMARK : new Date().getTime();
      const fileTypeResult = extName(file.name);
      const fileType = alwaysArray(fileTypeResult)[0];

      if (!fileType || !fileType.ext) {
        continue;
      }

      // get file buffer
      const buffer = await readFile(file.path);

      // save as svg if file type is svg
      if (fileType.ext === `svg` || fileType.ext === `ico`) {
        await writeFile(`${filesPath}/${fileName}.${fileType.ext}`, buffer);
        assets.push({
          url: `${assetsPath}/${fileName}.${fileType.ext}`,
          index: startIndex + index,
        });
      } else {
        // Save file to the FS
        const finalFormat = isWatermark ? 'png' : format;
        const fileFullName = `${fileName}.${finalFormat}`;
        let transform = sharp(buffer).toFormat(finalFormat);
        if (width) {
          transform = transform.resize(width);
        }
        await transform.toFile(`${filesPath}/${fileFullName}`);

        assets.push({
          url: `${assetsPath}/${fileFullName}`,
          index: startIndex + index,
        });
      }
    }

    return assets;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export const deleteUpload = async (filePath: string): Promise<boolean> => {
  try {
    const minFilesCount = 2;
    if (filePath === IMAGE_FALLBACK || filePath === IMAGE_FALLBACK_BOTTLE) {
      return true;
    }
    const pathParts = filePath.split('/');
    const pathWithoutFile = pathParts.slice(0, pathParts.length - 1);
    const dirPath = pathWithoutFile.join('/');
    const deleteDirPath = path.join(process.cwd(), dirPath);
    const dirFilesList = fs.readdirSync(deleteDirPath);

    // remove file and parent directory
    // if there is one file in directory
    if (dirFilesList.length < minFilesCount) {
      return new Promise((resolve) => {
        rimraf(deleteDirPath, (e: any) => {
          if (e) {
            resolve(false);
          } else {
            resolve(true);
          }
        });
      });
    }

    // remove file
    return new Promise((resolve) => {
      const fileFinalPath = path.join(process.cwd(), filePath);
      const exists = fs.existsSync(fileFinalPath);
      if (!exists) {
        resolve(true);
        return;
      }
      fs.unlink(fileFinalPath, (e) => {
        if (e) {
          console.log('deleteUpload util error ', e);
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  } catch (e) {
    console.log('deleteUpload util catch error ', e);
    return true;
  }
};

export const deleteAssetsDirectory = async (dirPath: string): Promise<boolean> => {
  try {
    const deleteDirPath = path.join(process.cwd(), dirPath);

    return new Promise((resolve) => {
      rimraf(deleteDirPath, (e: any) => {
        if (e) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  } catch (e) {
    console.log('deleteUpload util catch error ', e);
    return true;
  }
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
