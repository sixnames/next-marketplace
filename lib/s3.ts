import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import mime from 'mime-types';
import path from 'path';
import fs from 'fs';

// Set the AWS region
const awsRegion = `${process.env.NEXT_AWS_BUCKET_REGION}`; // e.g., "us-east-1"

// Create an S3 client service object
const s3 = new S3Client({
  region: awsRegion,
  credentials: {
    secretAccessKey: `${process.env.NEXT_AWS_SECRET_ACCESS_KEY}`,
    accessKeyId: `${process.env.NEXT_AWS_ACCESS_KEY_ID}`,
  },
});

export interface UploadFileToS3Interface {
  filePath: string;
  buffer: Buffer;
  contentType?: string;
}

export const uploadFileToS3 = async ({
  filePath,
  buffer,
  contentType,
}: UploadFileToS3Interface): Promise<string> => {
  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: `${process.env.NEXT_AWS_BUCKET_NAME}`,
        Key: filePath,
        Body: buffer,
        ContentType: contentType || undefined,
      }),
    );

    return `https://${process.env.NEXT_AWS_DOMAIN}/${filePath}`;
  } catch (e) {
    console.log('Error in uploadFileToS3 ', e);
    return `${process.env.NEXT_AWS_IMAGE_FALLBACK}`;
  }
};

export interface DeleteFileToS3Interface {
  filePath: string;
}

export const deleteFileFromS3 = async ({ filePath }: DeleteFileToS3Interface): Promise<boolean> => {
  try {
    const filePathArr = filePath.split(`https://${process.env.NEXT_AWS_DOMAIN}/`);
    const Key = filePathArr[1];
    await s3.send(
      new DeleteObjectCommand({
        Bucket: `${process.env.NEXT_AWS_BUCKET_NAME}`,
        Key,
      }),
    );

    return true;
  } catch (e) {
    console.log('Error in deleteFileFromS3 ', e);
    return false;
  }
};

export const findOrCreateFileInS3 = async ({
  filePath,
  buffer,
  contentType,
}: UploadFileToS3Interface): Promise<string> => {
  try {
    // Check if asset already exist
    const file = await s3.send(
      new GetObjectCommand({
        Bucket: `${process.env.NEXT_AWS_BUCKET_NAME}`,
        Key: filePath,
      }),
    );

    if (file) {
      return `https://${process.env.NEXT_AWS_DOMAIN}/${filePath}`;
    }

    const url = await uploadFileToS3({ filePath, buffer, contentType });
    return url;
  } catch (e) {
    console.log(`Uploading new file ${filePath} via findOrCreateFileInS3 `);
    const url = await uploadFileToS3({ filePath, buffer, contentType });
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
  const mimetype = mime.lookup(localFilePath) || undefined;
  const ext = path.extname(localFilePath);
  const buffer = fs.readFileSync(localFilePath);
  const contentType = ext === '.svg' ? 'image/svg+xml' : mimetype;

  const s3Url = await findOrCreateFileInS3({
    buffer,
    contentType,
    filePath: `${dist}/${fileName}${ext}`,
  });

  return s3Url;
}
