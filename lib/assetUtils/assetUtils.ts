import Formidable from 'formidable';
import { AssetModel } from 'db/dbModels';
import { alwaysArray } from 'lib/arrayUtils';
import { deleteFileFromS3, DeleteFileToS3Interface, uploadFileToS3 } from 'lib/s3';
import imagemin from 'imagemin';
import mkdirp from 'mkdirp';
import extName from 'ext-name';
import { FormatEnum } from 'sharp';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { promisify } from 'util';
const readFile = promisify(fs.readFile);

export interface StoreUploadsInterface {
  files: Formidable.Files;
  dist: string;
  startIndex?: number;
  format?: keyof FormatEnum;
  width?: number;
  height?: number;
}

export async function storeUploads({
  files,
  dist,
  startIndex = 0,
  format = 'webp',
}: StoreUploadsInterface): Promise<AssetModel[] | null> {
  try {
    const filesPath = path.join(process.cwd(), `public/assets`, dist);
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
          console.log('file ', assets.length);
        });
        continue;
      }

      // Save file to the FS
      const fileFullName = `${fileName}.${format}`;
      await sharp(buffer).toFormat(format).toFile(`${filesPath}/${fileFullName}`);

      assets.push({
        url: `${assetsPath}/${fileFullName}`,
        index: startIndex + index,
      });
    }

    console.log('Final ', assets.length);
    return assets;
  } catch (e) {
    console.log(e);
    return null;
  }
}

interface StoreRestApiUploadsAsset {
  buffer: Buffer;
  ext: string | false;
}

export interface StoreRestApiUploadsInterface {
  files: Formidable.Files;
  itemId: number | string;
  dist: string;
  startIndex?: number;
}

export async function storeRestApiUploads({
  files,
  itemId,
  dist,
  startIndex = 0,
}: StoreRestApiUploadsInterface): Promise<AssetModel[] | null> {
  try {
    const filePath = `${dist}/${itemId}`;
    const assets: AssetModel[] = [];
    const initialFiles: Formidable.File[][] = [];
    Object.keys(files).forEach((key) => {
      initialFiles.push(alwaysArray(files[key]));
    });

    const uploads: StoreRestApiUploadsAsset[] = [];
    for await (const file of initialFiles) {
      // const buffer = await fs.readFile(file[0].path);
      // console.log(file);
      // compress buffer

      const imageminResult = await imagemin(
        [file[0].path] /*{
        plugins: [
          imageminWebp({
            quality: 50,
          }),
        ],
      }*/,
      );

      const compressedBuffer = imageminResult[0]?.data;

      if (!compressedBuffer) {
        break;
      }

      const fileTypeResult = extName(file[0]?.name);
      const fileType = alwaysArray(fileTypeResult)[0];

      if (!fileType || !fileType.ext) {
        break;
      }

      uploads.push({
        buffer: compressedBuffer,
        ext: `${fileType.ext}`.replace('.', ''),
      });
    }

    for await (const [index, file] of uploads.entries()) {
      const currentTimeStamp = new Date().getTime();
      const fileIndex = index + 1;
      const finalStartIndex = startIndex + 1;
      const finalIndex = finalStartIndex + fileIndex;
      const { buffer, ext } = file;
      const fileName = `${currentTimeStamp}-${finalIndex}${ext ? `.${ext}` : ''}`;

      if (!buffer) {
        return null;
      }

      // Upload Buffer to the S3
      const url = await uploadFileToS3({
        buffer,
        filePath,
        fileName,
      });

      assets.push({ index: finalIndex, url });
    }

    return assets;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export const deleteUpload = async ({ filePath }: DeleteFileToS3Interface): Promise<boolean> => {
  return deleteFileFromS3({ filePath });
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
  let mainImage = `${process.env.OBJECT_STORAGE_IMAGE_FALLBACK}`;

  if (firstAsset) {
    mainImage = firstAsset.url;
  }
  return mainImage;
}
