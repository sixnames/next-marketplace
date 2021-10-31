// @ts-ignore
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
// import { get } from 'lodash';
require('dotenv').config();

async function updateProds() {
  console.log(' ');
  console.log('>>>>>>>>>>>>>>>>>>>>>>>>');
  console.log(' ');
  console.log(`Updating ${process.env.MONGO_DB_NAME}`);

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
