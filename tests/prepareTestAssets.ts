// import { ONE_WEEK } from '../config/common';
import products from '../cypress/fixtures/data/products/products';
const EasyYandexS3 = require('easy-yandex-s3');
const mkdirp = require('mkdirp');
const path = require('path');
const fs = require('fs');

require('dotenv').config();

function uploadTestAssets() {
  const s3 = new EasyYandexS3({
    auth: {
      accessKeyId: `${process.env.OBJECT_STORAGE_KEY_ID}`,
      secretAccessKey: `${process.env.OBJECT_STORAGE_KEY}`,
    },
    Bucket: `${process.env.OBJECT_STORAGE_BUCKET_NAME}`,
    // debug: true,
  });

  s3.Upload(
    {
      path: './cypress/fixtures/assets',
      save_name: true,
    },
    '/',
  )
    .then(() => {
      console.log('Assets uploaded');
    })
    .catch((e: any) => {
      console.log(e);
    });
}

(function prepareTestAssets() {
  products.forEach(({ itemId }) => {
    const pathToSrc = path.join(process.cwd(), 'cypress/fixtures/test-image-0.png');
    const fileName = `${itemId}-0.png`;
    const pathToDist = path.join(process.cwd(), `cypress/fixtures/assets/products/${itemId}`);
    fs.access(pathToDist, (err: any) => {
      if (err) {
        mkdirp(pathToDist).then(() => {
          fs.copyFileSync(pathToSrc, path.join(pathToDist, fileName));
        });
      } else {
        fs.copyFileSync(pathToSrc, path.join(pathToDist, fileName));
      }
    });
  });

  uploadTestAssets();
})();
