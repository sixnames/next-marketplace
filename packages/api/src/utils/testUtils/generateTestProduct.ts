import { ProductAttributesGroup } from '../../entities/Product';
import { ASSETS_DIST_PRODUCTS } from '../../config';
import { DEFAULT_LANG, SECONDARY_LANG } from '@yagu/config';
import { generateDefaultLangSlug } from '../slug';
import fs from 'fs';
import mkdirp from 'mkdirp';
import sharp from 'sharp';
import { LanguageType } from '../../entities/common';

export interface GetProductCitiesInterface {
  name: LanguageType[];
  cardName: LanguageType[];
  description: LanguageType[];
  rubrics: string[];
  attributesGroups: ProductAttributesGroup[];
  price: number;
  priority: number;
}

export async function generateTestProduct(
  node: GetProductCitiesInterface,
  active = true,
): Promise<any[]> {
  const initialFilePath = './src/test/test-image-0.png';
  const slug = generateDefaultLangSlug(node.cardName);
  const productName = node.name[0].value;
  const filesPath = `./assets/${ASSETS_DIST_PRODUCTS}/${slug}`;
  const filesResolvePath = `/assets/${ASSETS_DIST_PRODUCTS}/${slug}`;
  const fileName = `${slug}-${0}`;
  const fileFormat = 'webp';
  const resolvePath = `${filesResolvePath}/${fileName}.${fileFormat}`;
  const finalPath = `${filesPath}/${fileName}.${fileFormat}`;

  const resolveObject = {
    ...node,
    name: [
      {
        key: DEFAULT_LANG,
        value: `${productName}`,
      },
      {
        key: SECONDARY_LANG,
        value: `${productName}-${SECONDARY_LANG}`,
      },
    ],
    slug,
    assets: [
      {
        index: 0,
        url: resolvePath,
      },
    ],
    active,
  };

  const exists = fs.existsSync(filesPath);
  if (!exists) {
    await mkdirp(filesPath);
  } else {
    return new Promise<any>((resolve) => {
      resolve(resolveObject);
    });
  }

  return new Promise<any>((resolve, reject) => {
    sharp(initialFilePath)
      .webp()
      .toFile(finalPath)
      .then(() => {
        resolve(resolveObject);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
