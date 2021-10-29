// @ts-ignore
import EasyYandexS3 from 'easy-yandex-s3';
import mkdirp from 'mkdirp';
import FileType from 'file-type';
import sharp from 'sharp';
import fetch from 'node-fetch';
import fs from 'fs';
require('dotenv').config();

interface ContentsInterface {
  Key: string;
}

interface CommonPrefixesInterface {
  Prefix: string;
}

interface GetListInterface {
  Contents?: ContentsInterface[];
  Prefix: string;
  CommonPrefixes?: CommonPrefixesInterface[];
}

interface PathInterface {
  src: string;
  dist: string;
}

const basePath = 'public/assets/';
async function getPaths(initialPath: string, Bucket: string, s3Instance: any) {
  try {
    const list: GetListInterface = await s3Instance.GetList(initialPath);
    for await (const content of list.Contents || []) {
      const path: PathInterface = {
        src: `${content.Key}`,
        dist: `${basePath}${content.Key}`,
      };
      await mkdirp(`${basePath}/${initialPath}`);
      const url = `https://${Bucket}.storage.yandexcloud.net/${path.src}`;
      console.log(path.src);
      const response = await fetch(url);
      const buffer = await response.buffer();
      if (!buffer) {
        console.log('Error ========================== ', path.src);
        continue;
      }

      const fileType = await FileType.fromBuffer(buffer);
      if (!fileType) {
        console.log('not image ', path.src);
        await fs.writeFile(path.dist, buffer.toString(), (error) => {
          if (error) {
            console.log('fs.writeFile Error ========================== ', path.dist);
          }
        });
        continue;
      }
      await sharp(buffer).trim().toFile(path.dist);
    }

    for await (const prefix of list.CommonPrefixes || []) {
      await getPaths(prefix.Prefix, Bucket, s3Instance);
    }
  } catch (e) {
    console.log(e);
  }
}

async function updateProds() {
  console.log(' ');
  console.log('>>>>>>>>>>>>>>>>>>>>>>>>');
  console.log(' ');
  console.log(`Updating ${process.env.OBJECT_STORAGE_BUCKET_NAME} bucket`);
  const s3Instance = new EasyYandexS3({
    auth: {
      accessKeyId: `${process.env.OBJECT_STORAGE_KEY_ID}`,
      secretAccessKey: `${process.env.OBJECT_STORAGE_KEY}`,
    },
    Bucket: `${process.env.OBJECT_STORAGE_BUCKET_NAME}`,
  });

  await getPaths('', `${process.env.OBJECT_STORAGE_BUCKET_NAME}`, s3Instance);

  console.log(`Done ${process.env.OBJECT_STORAGE_BUCKET_NAME} bucket`);
  console.log(' ');
}

(() => {
  updateProds()
    .then(() => {
      console.log('Success!');
      process.exit();
    })
    .catch((e) => {
      console.log(e);
      process.exit();
    });
})();
