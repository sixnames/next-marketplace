import { ASSETS_DIST_PRODUCTS } from '../../config';
import { DEFAULT_LANG, SECONDARY_LANG } from '@yagu/config';
import generateTestAsset from './generateTestAsset';
import { ProductAttributesGroup } from '../../entities/ProductAttributesGroup';
import { Translation } from '../../entities/Translation';
import { CityCounter } from '../../entities/CityCounter';

export interface GetProductCitiesInterface {
  name: Translation[];
  cardName: Translation[];
  description: Translation[];
  rubrics: string[];
  attributesGroups: ProductAttributesGroup[];
  price: number;
  priority: number;
  slug: string;
  brand?: string;
  brandCollection?: string;
  manufacturer: string;
  views: CityCounter[];
}

export async function generateTestProduct(
  node: GetProductCitiesInterface,
  active = true,
): Promise<any> {
  const slug = node.slug;
  const productName = node.name[0].value;

  const assetA = await generateTestAsset({
    targetFileName: 'test-image-0',
    dist: ASSETS_DIST_PRODUCTS,
    slug,
  });

  return {
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
    assets: [assetA],
    active,
  };
}
