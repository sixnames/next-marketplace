// @ts-ignore
import EasyYandexS3 from '../../../lib/s3';
// import { ASSETS_DIST_PRODUCTS } from '../../../config/common';
/*import { alwaysArray } from '../../../lib/arrayUtils';
import { CONFIG_VARIANT_ASSET, DEFAULT_CITY, DEFAULT_LOCALE } from '../../../config/common';
import {
  COL_BLOG_POSTS,
  COL_BRANDS,
  COL_CATEGORIES,
  COL_COMPANIES,
  COL_CONFIGS,
  COL_PAGE_TEMPLATES,
  COL_PAGES,
  COL_PRODUCT_ASSETS,
  COL_PRODUCT_CARD_CONTENTS,
  COL_PRODUCTS,
  COL_PROMO,
  COL_SHOP_PRODUCTS,
  COL_SHOPS,
} from '../../../db/collectionNames';
import {
  BlogPostModel,
  BrandModel,
  CategoryModel,
  CompanyModel,
  ConfigModel,
  PageModel,
  PagesTemplateModel,
  ProductAssetsModel,
  ProductCardContentModel,
  ProductModel,
  PromoModel,
  ShopModel,
  ShopProductModel,
} from '../../../db/dbModels';
import { getProdDb } from './getProdDb';*/
import mkdirp from 'mkdirp';
import FileType from 'file-type';
import sharp from 'sharp';
import fetch from 'node-fetch';
import fs from 'fs';
import { promisify } from 'util';
const writeFile = promisify(fs.writeFile);
// import { get } from 'lodash';
require('dotenv').config();

interface ContentsInterface {
  Key: string;
}

interface CommonPrefixesInterface {
  Prefix: string;
}

interface GetListInterface {
  IsTruncated: boolean;
  Contents?: ContentsInterface[];
  Prefix: string;
  CommonPrefixes?: CommonPrefixesInterface[];
  NextContinuationToken?: string;
}

interface PathInterface {
  src: string;
  dist: string;
}

const basePath = 'assets/';
async function getPaths(
  initialPath: string,
  Bucket: string,
  s3Instance: any,
  ContinuationToken?: string,
) {
  try {
    const list: GetListInterface = await s3Instance.GetList(initialPath, ContinuationToken);

    for await (const content of list.Contents || []) {
      const path: PathInterface = {
        src: `${content.Key}`,
        dist: `${basePath}${content.Key}`,
      };
      await mkdirp(`${basePath}/${initialPath}`);
      const url = `https://${Bucket}.storage.yandexcloud.net/${path.src}`;
      const response = await fetch(url);
      const buffer = await response.buffer();
      if (!buffer) {
        console.log('Error ========================== ', path.src);
        continue;
      }

      const fileType = await FileType.fromBuffer(buffer);
      if (!fileType || fileType.ext === 'ico') {
        await writeFile(path.dist, buffer);
        continue;
      }
      await sharp(buffer).trim().toFile(path.dist);
    }

    for await (const prefix of list.CommonPrefixes || []) {
      await getPaths(prefix.Prefix, Bucket, s3Instance);
    }

    if (list.IsTruncated && list.NextContinuationToken) {
      console.log('IsTruncated ', initialPath);
      await getPaths(initialPath, Bucket, s3Instance, list.NextContinuationToken);
    }
  } catch (e) {
    console.log('=========================== Catch Error ===========================');
    console.log(e);
    console.log('===================================================================');
  }
}

async function updateProds() {
  console.log(' ');
  console.log('>>>>>>>>>>>>>>>>>>>>>>>>');
  console.log(' ');
  console.log(`Updating ${process.env.MONGO_DB_NAME}`);
  const s3Instance = new EasyYandexS3({
    auth: {
      accessKeyId: `${process.env.OBJECT_STORAGE_KEY_ID}`,
      secretAccessKey: `${process.env.OBJECT_STORAGE_KEY}`,
    },
    Bucket: `${process.env.OBJECT_STORAGE_BUCKET_NAME}`,
  });
  await getPaths('', `${process.env.OBJECT_STORAGE_BUCKET_NAME}`, s3Instance);
  console.log('assets downloaded ============================');

  // updating db
  // console.log('updating db');
  /*const { db, client } = await getProdDb({
    dbName: `${process.env.MONGO_DB_NAME}`,
    uri: `${process.env.MONGO_URL}`,
  });
  function replaceUrl(key: string) {
    return key.replace(`https://${process.env.OBJECT_STORAGE_DOMAIN}`, '/assets');
  }*/

  // blog
  /*const blogPostsCollection = db.collection<BlogPostModel>(COL_BLOG_POSTS);
  const posts = await blogPostsCollection.find({}).toArray();
  for await (const doc of posts) {
    const updated: BlogPostModel = {
      ...doc,
      previewImage: doc.previewImage ? replaceUrl(doc.previewImage) : null,
      assetKeys: doc.assetKeys.map(replaceUrl),
      content: replaceUrl(doc.content),
    };
    const { _id, ...rest } = updated;
    await blogPostsCollection.findOneAndUpdate(
      { _id },
      {
        $set: rest,
      },
    );
  }
  console.log('blog posts updated');

  // brands
  const brandsCollection = db.collection<BrandModel>(COL_BRANDS);
  const brands = await brandsCollection.find({}).toArray();
  for await (const doc of brands) {
    const updated: BrandModel = {
      ...doc,
      logo: doc.logo ? replaceUrl(doc.logo) : '',
    };
    const { _id, ...rest } = updated;
    await brandsCollection.findOneAndUpdate(
      { _id },
      {
        $set: rest,
      },
    );
  }
  console.log('brands updated');

  // card contents
  const cardContentsCollection = db.collection<ProductCardContentModel>(COL_PRODUCT_CARD_CONTENTS);
  const cardContents = await cardContentsCollection.find({}).toArray();
  for await (const doc of cardContents) {
    const content = Object.keys(doc.content).reduce((acc: Record<any, any>, key) => {
      const city = doc.content[key] as string;
      if (!city) {
        return acc;
      }
      acc[key] = replaceUrl(city);
      return acc;
    }, {});
    const updated: ProductCardContentModel = {
      ...doc,
      assetKeys: doc.assetKeys.map(replaceUrl),
      content,
    };
    const { _id, ...rest } = updated;
    await cardContentsCollection.findOneAndUpdate(
      { _id },
      {
        $set: rest,
      },
    );
  }
  console.log('card contents updated');

  // categories
  const categoriesCollection = db.collection<CategoryModel>(COL_CATEGORIES);
  const categories = await categoriesCollection.find({}).toArray();
  for await (const doc of categories) {
    const updated: CategoryModel = {
      ...doc,
      image: doc.image ? replaceUrl(doc.image) : '',
    };
    const { _id, ...rest } = updated;
    await categoriesCollection.findOneAndUpdate(
      { _id },
      {
        $set: rest,
      },
    );
  }
  console.log('categories updated');

  // companies
  const companiesCollection = db.collection<CompanyModel>(COL_COMPANIES);
  const companies = await companiesCollection.find({}).toArray();
  for await (const doc of companies) {
    const updated: CompanyModel = {
      ...doc,
      logo: {
        ...doc.logo,
        url: replaceUrl(doc.logo.url),
      },
    };
    const { _id, ...rest } = updated;
    await companiesCollection.findOneAndUpdate(
      { _id },
      {
        $set: rest,
      },
    );
  }
  console.log('companies updated');

  // configs
  const configsCollection = db.collection<ConfigModel>(COL_CONFIGS);
  const configs = await configsCollection
    .find({
      variant: CONFIG_VARIANT_ASSET,
    })
    .toArray();
  for await (const doc of configs) {
    const value = alwaysArray(get(doc, `cities.${DEFAULT_CITY}.${DEFAULT_LOCALE}`));
    const updated: ConfigModel = {
      ...doc,
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: value.map(replaceUrl),
        },
      },
    };
    const { _id, ...rest } = updated;
    await configsCollection.findOneAndUpdate(
      { _id },
      {
        $set: rest,
      },
    );
  }
  console.log('configs updated');

  // pages
  const pagesCollection = db.collection<PageModel>(COL_PAGES);
  const pages = await pagesCollection.find({}).toArray();
  for await (const doc of pages) {
    const updated: PageModel = {
      ...doc,
      assetKeys: doc.assetKeys.map(replaceUrl),
      content: replaceUrl(doc.content),
      mainBanner: doc.mainBanner
        ? {
            ...doc.mainBanner,
            url: replaceUrl(doc.mainBanner.url),
          }
        : null,
      mainBannerMobile: doc.mainBannerMobile
        ? {
            ...doc.mainBannerMobile,
            url: replaceUrl(doc.mainBannerMobile.url),
          }
        : null,
      secondaryBanner: doc.secondaryBanner
        ? {
            ...doc.secondaryBanner,
            url: replaceUrl(doc.secondaryBanner.url),
          }
        : null,
    };
    const { _id, ...rest } = updated;
    await pagesCollection.findOneAndUpdate(
      { _id },
      {
        $set: rest,
      },
    );
  }

  const pageTemplatesCollection = db.collection<PagesTemplateModel>(COL_PAGE_TEMPLATES);
  const pageTemplates = await pageTemplatesCollection.find({}).toArray();
  for await (const doc of pageTemplates) {
    const updated: PagesTemplateModel = {
      ...doc,
      assetKeys: doc.assetKeys.map(replaceUrl),
      content: replaceUrl(doc.content),
      mainBanner: doc.mainBanner
        ? {
            ...doc.mainBanner,
            url: replaceUrl(doc.mainBanner.url),
          }
        : null,
      mainBannerMobile: doc.mainBannerMobile
        ? {
            ...doc.mainBannerMobile,
            url: replaceUrl(doc.mainBannerMobile.url),
          }
        : null,
      secondaryBanner: doc.secondaryBanner
        ? {
            ...doc.secondaryBanner,
            url: replaceUrl(doc.secondaryBanner.url),
          }
        : null,
    };
    const { _id, ...rest } = updated;
    await pageTemplatesCollection.findOneAndUpdate(
      { _id },
      {
        $set: rest,
      },
    );
  }
  console.log('pages updated');

  // productAssets
  const productAssetsCollection = db.collection<ProductAssetsModel>(COL_PRODUCT_ASSETS);
  const productAssets = await productAssetsCollection.find({}).toArray();
  for await (const doc of productAssets) {
    const updated: ProductAssetsModel = {
      ...doc,
      assets: doc.assets.map((asset) => {
        return {
          ...asset,
          url: replaceUrl(asset.url),
        };
      }),
    };
    const { _id, ...rest } = updated;
    await productAssetsCollection.findOneAndUpdate(
      { _id },
      {
        $set: rest,
      },
    );
  }
  console.log('productAssets updated');

  // products
  const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
  const products = await productsCollection.find({}).toArray();
  for await (const doc of products) {
    const updated: ProductModel = {
      ...doc,
      mainImage: replaceUrl(doc.mainImage),
    };
    const { _id, ...rest } = updated;
    await productsCollection.findOneAndUpdate(
      { _id },
      {
        $set: rest,
      },
    );
  }
  console.log('products updated');

  // promos
  const promosCollection = db.collection<PromoModel>(COL_PROMO);
  const promos = await promosCollection.find({}).toArray();
  for await (const doc of promos) {
    const updated: PromoModel = {
      ...doc,
      assetKeys: doc.assetKeys.map(replaceUrl),
      content: replaceUrl(doc.content),
      mainBanner: doc.mainBanner
        ? {
            ...doc.mainBanner,
            url: replaceUrl(doc.mainBanner.url),
          }
        : null,
      mainBannerMobile: doc.mainBannerMobile
        ? {
            ...doc.mainBannerMobile,
            url: replaceUrl(doc.mainBannerMobile.url),
          }
        : null,
      secondaryBanner: doc.secondaryBanner
        ? {
            ...doc.secondaryBanner,
            url: replaceUrl(doc.secondaryBanner.url),
          }
        : null,
    };
    const { _id, ...rest } = updated;
    await promosCollection.findOneAndUpdate(
      { _id },
      {
        $set: rest,
      },
    );
  }
  console.log('promos updated');

  // shopProducts
  const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
  const shopProducts = await shopProductsCollection.find({}).toArray();
  for await (const doc of shopProducts) {
    const updated: ShopProductModel = {
      ...doc,
      mainImage: replaceUrl(doc.mainImage),
    };
    const { _id, ...rest } = updated;
    await shopProductsCollection.findOneAndUpdate(
      { _id },
      {
        $set: rest,
      },
    );
  }
  console.log('shopProducts updated');

  // shops
  const shopsCollection = db.collection<ShopModel>(COL_SHOPS);
  const shops = await shopsCollection.find({}).toArray();
  for await (const doc of shops) {
    const updated: ShopModel = {
      ...doc,
      mainImage: replaceUrl(doc.mainImage),
      logo: {
        ...doc.logo,
        url: replaceUrl(doc.logo.url),
      },
      assets: doc.assets.map((asset) => {
        return {
          ...asset,
          url: replaceUrl(asset.url),
        };
      }),
      mapMarker: doc.mapMarker
        ? {
            lightTheme: doc.mapMarker.lightTheme ? replaceUrl(doc.mapMarker.lightTheme) : null,
            darkTheme: doc.mapMarker.darkTheme ? replaceUrl(doc.mapMarker.darkTheme) : null,
          }
        : null,
    };
    const { _id, ...rest } = updated;
    await shopsCollection.findOneAndUpdate(
      { _id },
      {
        $set: rest,
      },
    );
  }
  console.log('shops updated');*/

  // disconnect form db
  // await client.close();
  console.log(`Done ${process.env.MONGO_DB_NAME}`);
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
