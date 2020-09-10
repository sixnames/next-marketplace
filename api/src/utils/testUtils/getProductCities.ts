import { ProductAttributesGroup, ProductCity } from '../../entities/Product';
import { DEFAULT_CITY } from '../../config';
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

export async function getProductCities(
  node: GetProductCitiesInterface,
  active = true,
): Promise<ProductCity[]> {
  const cities = [DEFAULT_CITY, 'ny'];
  const initialFilePath = './test/test-image-0.png';
  const slug = generateDefaultLangSlug(node.cardName);
  const productName = node.name[0].value;

  return Promise.all(
    cities.map(async (city) => {
      const filesPath = `./assets/${city}/${slug}`;
      const filesResolvePath = `/assets/${city}/${slug}`;
      const fileName = `${slug}-${0}`;
      const fileFormat = 'webp';
      const resolvePath = `${filesResolvePath}/${fileName}.${fileFormat}`;
      const finalPath = `${filesPath}/${fileName}.${fileFormat}`;

      const resolveObject = {
        key: city,
        node: {
          ...node,
          name:
            city === DEFAULT_CITY
              ? node.name
              : [
                  {
                    key: 'ru',
                    value: `${productName}-${city}`,
                  },
                  {
                    key: 'en',
                    value: `${productName}-${city}`,
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
        },
      };

      const exists = fs.existsSync(filesPath);
      if (!exists) {
        await mkdirp(filesPath);
      } else {
        return new Promise<ProductCity>((resolve) => {
          resolve(resolveObject);
        });
      }

      return new Promise<ProductCity>((resolve, reject) => {
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
    }),
  );
}
