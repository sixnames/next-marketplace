import { ReadStream } from 'fs';
import { AssetModel, UploadModel } from 'db/dbModels';
import { deleteFileFromS3, DeleteFileToS3Interface, uploadFileToS3 } from 'lib/s3';
// import sharp, { AvailableFormatInfo, FormatEnum } from 'sharp';

export const getBufferFromFileStream = (stream: ReadStream) => {
  return new Promise<Buffer>((resolve, reject) => {
    // Store file data chunks in this array
    const chunks: any[] = [];
    // We can use this variable to store the final data
    let fileBuffer;

    // An error occurred with the stream
    stream.once('error', (error) => {
      reject(error);
    });

    // File is done being read
    stream.once('end', () => {
      // create the final data Buffer from data chunks;
      fileBuffer = Buffer.concat(chunks);
      resolve(fileBuffer);
    });

    // Data is flushed from fileStream in chunks,
    // this callback will be executed for each chunk
    stream.on('data', (chunk) => {
      chunks.push(chunk); // push data chunk to array
    });
  });
};

/*interface GetSharpBufferInterface {
  file: UploadModel;
  format?: keyof FormatEnum | AvailableFormatInfo;
  width?: number;
  height?: number;
  quality?: number;
}

export async function getSharpBuffer({
  file,
  format,
  width,
  height,
  quality = 80,
}: GetSharpBufferInterface): Promise<Buffer | null> {
  try {
    const { createReadStream } = await file;

    // Read file into stream.Readable
    const fileStream = createReadStream();

    // Convert stream to the Buffer
    const buffer = await getBufferFromFileStream(fileStream);

    let transform = sharp(buffer);

    if (width || height) {
      transform = transform.resize(width, height);
    }

    if (format) {
      transform = transform.toFormat(format, { quality });
    } else {
      transform = transform.webp({ quality });
    }

    return transform.toBuffer();
  } catch (e) {
    console.log('getSharpImage ERROR==== ', e);
    return null;
  }
}*/

// export interface StoreUploadsInterface extends Omit<GetSharpBufferInterface, 'file'> {
export interface StoreUploadsInterface {
  files: UploadModel[];
  itemId: number | string;
  dist: string;
  startIndex?: number;
  asImage?: boolean;

  width?: number;
  height?: number;
  quality?: number;
}

export const storeUploads = async ({
  files,
  itemId,
  dist,
  startIndex = 0,
}: // asImage,
// width,
// height,
// format,
// quality,
StoreUploadsInterface): Promise<AssetModel[] | null> => {
  try {
    const filePath = `${dist}/${itemId}`;
    const assets: AssetModel[] = [];

    for await (const [index, file] of files.entries()) {
      const fileIndex = index + 1;
      const finalStartIndex = startIndex + 1;
      const finalIndex = finalStartIndex + fileIndex;

      const { createReadStream, ext } = await file;
      let fileName = ``;

      // Read file into stream.Readable
      const fileStream = createReadStream();

      // Convert stream to the Buffer
      let buffer: Buffer | null = null;

      buffer = await getBufferFromFileStream(fileStream);
      fileName = `${itemId}-${finalIndex}${ext}`;

      /*if (!asImage) {
        buffer = await getBufferFromFileStream(fileStream);
        fileName = `${itemId}-${finalIndex}-${ext}`;
      } else {
        const extension = format ? `.${format}` : '.webp';
        buffer = await getSharpBuffer({
          file,
          width,
          height,
          format,
          quality,
        });
        fileName = `${itemId}-${finalIndex}-${extension}`;
      }*/

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
    return [];
  }
};

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
