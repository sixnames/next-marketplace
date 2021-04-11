// import mime from 'mime-types';
import path from 'path';
import fs from 'fs';
import EasyYandexS3 from 'easy-yandex-s3';

const s3 = new EasyYandexS3({
  auth: {
    accessKeyId: `${process.env.OBJECT_STORAGE_KEY_ID}`,
    secretAccessKey: `${process.env.OBJECT_STORAGE_KEY}`,
  },
  Bucket: `${process.env.OBJECT_STORAGE_BUCKET_NAME}`,
  // debug: process.env.NODE_ENV !== 'production',
});

export interface UploadFileToS3Interface {
  filePath: string;
  fileName: string;
  buffer: Buffer;
}

export const uploadFileToS3 = async ({
  filePath,
  fileName,
  buffer,
}: UploadFileToS3Interface): Promise<string> => {
  try {
    const upload = await s3.Upload(
      {
        buffer,
        name: fileName,
      },
      filePath,
    );

    if (upload) {
      return upload.Location;
    }
    return `https://${process.env.OBJECT_STORAGE_DOMAIN}/${filePath}`;
  } catch (e) {
    console.log('Error in uploadFileToS3 ', e);
    return `${process.env.OBJECT_STORAGE_IMAGE_FALLBACK}`;
  }
};

export interface DeleteFileToS3Interface {
  filePath: string;
}

export const deleteFileFromS3 = async ({ filePath }: DeleteFileToS3Interface): Promise<boolean> => {
  try {
    const filePathArr = filePath.split(`https://${process.env.OBJECT_STORAGE_DOMAIN}/`);
    const Key = filePathArr[1];
    const remove = await s3.Remove(Key);

    return remove;
  } catch (e) {
    console.log('Error in deleteFileFromS3 ', e);
    return false;
  }
};

export const findOrCreateFileInS3 = async ({
  filePath,
  fileName,
  buffer,
}: UploadFileToS3Interface): Promise<string> => {
  try {
    // Check if asset already exist
    const file = await s3.Download(filePath);

    if (file) {
      return `https://${process.env.OBJECT_STORAGE_DOMAIN}/${filePath}`;
    }

    const url = await uploadFileToS3({ filePath, buffer, fileName });
    return url;
  } catch (e) {
    console.log(`Uploading new file ${filePath} via findOrCreateFileInS3 `);
    const url = await uploadFileToS3({ filePath, buffer, fileName });
    return url;
  }
};

export interface FindOrCreateTestAssetInterface {
  localFilePath: string;
  dist: string;
  fileName: string | number;
}

export async function findOrCreateTestAsset({
  localFilePath,
  dist,
  fileName,
}: FindOrCreateTestAssetInterface): Promise<string> {
  // const mimetype = mime.lookup(localFilePath) || undefined;
  const ext = path.extname(localFilePath);
  const buffer = fs.readFileSync(localFilePath);
  // const contentType = ext === '.svg' ? 'image/svg+xml' : mimetype;

  const s3Url = await findOrCreateFileInS3({
    buffer,
    filePath: `${dist}`,
    fileName: `${fileName}${ext}`,
  });

  return s3Url;
}
