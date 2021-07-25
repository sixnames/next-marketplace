const EasyYandexS3 = require('easy-yandex-s3');

require('dotenv').config();

export async function uploadTestAssets(srcPath: string, bucketName: string, distPath = '/') {
  const s3 = new EasyYandexS3({
    auth: {
      accessKeyId: `${process.env.OBJECT_STORAGE_KEY_ID}`,
      secretAccessKey: `${process.env.OBJECT_STORAGE_KEY}`,
    },
    Bucket: bucketName,
    // debug: true,
  });

  try {
    await s3.Upload(
      {
        path: srcPath,
        save_name: true,
      },
      distPath,
    );
    console.log(`${distPath} assets uploaded`);
  } catch (e) {
    console.log(e);
  }
}
