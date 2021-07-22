import Formidable from 'formidable';
import { AssetModel } from 'db/dbModels';
import { alwaysArray } from 'lib/arrayUtils';
import { deleteFileFromS3, DeleteFileToS3Interface, uploadFileToS3 } from 'lib/s3';
import imagemin from 'imagemin';
// import imageminWebp from 'imagemin-webp';
import extName from 'ext-name';

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

      console.log({
        fileName,
        buffer,
      });

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
