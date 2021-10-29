// import mime from 'mime-types';
// import path from 'path';
// import fs from 'fs';
import EasyYandexS3 from 'easy-yandex-s3';

export const s3Instance = new EasyYandexS3({
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
    const upload = await s3Instance.Upload(
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
    if (
      filePath === `${process.env.OBJECT_STORAGE_IMAGE_FALLBACK}` ||
      filePath === `${process.env.OBJECT_STORAGE_IMAGE_FALLBACK}`
    ) {
      return true;
    }

    const filePathArr = filePath.split(`https://${process.env.OBJECT_STORAGE_DOMAIN}/`);
    const Key = filePathArr[1];
    const remove = await s3Instance.Remove(Key);

    return remove;
  } catch (e) {
    console.log('Error in deleteFileFromS3 ', e);
    return false;
  }
};
