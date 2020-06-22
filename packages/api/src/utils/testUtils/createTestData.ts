import { clearTestDataHandler } from './clearTestData';
import {
  MOCK_OPTIONS,
  MOCK_OPTIONS_GROUP,
  MOCK_OPTIONS_GROUP_FOR_DELETE,
  MOCK_ATTRIBUTE_MULTIPLE,
  MOCK_ATTRIBUTES_GROUP,
  MOCK_ATTRIBUTES_GROUP_FOR_DELETE,
  MOCK_ATTRIBUTE_SELECT,
  MOCK_ATTRIBUTE_STRING,
  MOCK_ATTRIBUTE_NUMBER,
  MOCK_ATTRIBUTES_GROUP_B,
  MOCK_RUBRIC_TYPE_EQUIPMENT,
  MOCK_RUBRIC_TYPE_STAGE,
  MOCK_RUBRIC_LEVEL_ONE,
  MOCK_RUBRIC_LEVEL_THREE,
  MOCK_RUBRIC_LEVEL_TWO,
  MOCK_RUBRIC_LEVEL_THREE_B,
  MOCK_RUBRIC_LEVEL_TWO_TABLES,
  MOCK_RUBRIC_LEVEL_THREE_TABLES,
  MOCK_RUBRIC_LEVEL_THREE_TABLES_B,
  MOCK_PRODUCT_FOR_DELETE,
  MOCK_PRODUCT_B_PRODUCT,
  MOCK_PRODUCT,
  // MOCK_PRODUCT_FOR_DELETE,
  // MOCK_PRODUCT_B_PRODUCT,
  // MOCK_PRODUCT_IMAGES,
} from '@rg/config';
import createInitialData from '../createInitialData';
import { OptionModel } from '../../entities/Option';
import { OptionsGroupModel } from '../../entities/OptionsGroup';
import { AttributeModel, AttributeVariantEnum } from '../../entities/Attribute';
import { AttributesGroupModel } from '../../entities/AttributesGroup';
import { generateDefaultLangSlug } from '../slug';
import { RubricVariantModel } from '../../entities/RubricVariant';
import { RubricModel } from '../../entities/Rubric';
import { DEFAULT_CITY } from '../../config';
import { ProductCity, ProductModel } from '../../entities/Product';
import { Types } from 'mongoose';
import sharp from 'sharp';
import fs from 'fs';
import mkdirp from 'mkdirp';

interface LangInterface {
  key: string;
  value: string;
}

interface GetRubricCitiesInterface {
  name: LangInterface[];
  catalogueName: LangInterface[];
  level: number;
  slug: string;
  variant?: string;
  parent?: Types.ObjectId | null;
  attributesGroups: {
    showInCatalogueFilter: boolean;
    node: string;
  }[];
}

function getRubricCities(node: GetRubricCitiesInterface) {
  return [
    {
      key: DEFAULT_CITY,
      node,
    },
    {
      key: 'spb',
      node: {
        ...node,
        name: [
          {
            key: 'ru',
            value: `${node.name[0].value}-spb`,
          },
          {
            key: 'en',
            value: `${node.name[1].value}-spb`,
          },
        ],
      },
    },
  ];
}

interface GetProductCitiesInterface {
  name: LangInterface[];
  cardName: LangInterface[];
  description: LangInterface[];
  rubrics: string[];
  attributesSource: string;
  attributesGroups: {
    showInCard: boolean;
    node: string;
    attributes: {
      showInCard: boolean;
      node: string;
      key: number;
      value: string[];
    }[];
  }[];
  price: number;
}

async function getProductCities(
  node: GetProductCitiesInterface,
  active = true,
): Promise<ProductCity[]> {
  const cities = [DEFAULT_CITY, 'spb'];
  const initialFilePath = './test/test-image-0.jpg';
  const slug = generateDefaultLangSlug(node.cardName);
  const productName = node.name[0].value;

  return Promise.all(
    cities.map(async (city) => {
      const filesPath = `./assets/${city}/${slug}`;
      const filesResolvePath = `/assets/${city}/${slug}`;
      const fileName = `${slug}-${0}`;
      const resolvePath = `${filesResolvePath}/${fileName}.jpg`;
      const finalPath = `${filesPath}/${fileName}.jpg`;

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
        return new Promise<ProductCity>(async (resolve) => {
          resolve(resolveObject);
        });
      }

      return new Promise<ProductCity>(async (resolve, reject) => {
        sharp(initialFilePath)
          .jpeg()
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

const createTestData = async () => {
  try {
    // Clear old test data
    await clearTestDataHandler();

    // Metrics and admin user
    await createInitialData();

    // Options
    const options = await OptionModel.insertMany(MOCK_OPTIONS);
    const optionsIds = options.map(({ id }) => id);

    await OptionsGroupModel.create({
      ...MOCK_OPTIONS_GROUP_FOR_DELETE,
      options: optionsIds,
    });
    const optionsGroup = await OptionsGroupModel.create({
      ...MOCK_OPTIONS_GROUP,
      options: optionsIds,
    });

    // Attributes
    const attributeMultiple = await AttributeModel.create({
      ...MOCK_ATTRIBUTE_MULTIPLE,
      variant: MOCK_ATTRIBUTE_MULTIPLE.variant as AttributeVariantEnum,
      options: optionsGroup.id,
    });

    const attributeSelect = await AttributeModel.create({
      ...MOCK_ATTRIBUTE_SELECT,
      variant: MOCK_ATTRIBUTE_SELECT.variant as AttributeVariantEnum,
      options: optionsGroup.id,
    });

    const attributeString = await AttributeModel.create({
      ...MOCK_ATTRIBUTE_STRING,
      variant: MOCK_ATTRIBUTE_STRING.variant as AttributeVariantEnum,
      options: optionsGroup.id,
    });

    const attributeNumber = await AttributeModel.create({
      ...MOCK_ATTRIBUTE_NUMBER,
      variant: MOCK_ATTRIBUTE_NUMBER.variant as AttributeVariantEnum,
      options: optionsGroup.id,
    });

    await AttributesGroupModel.create({
      ...MOCK_ATTRIBUTES_GROUP_FOR_DELETE,
      attributes: [],
    });

    const attributesGroup = await AttributesGroupModel.create({
      ...MOCK_ATTRIBUTES_GROUP,
      attributes: [
        attributeMultiple.id,
        attributeSelect.id,
        attributeString.id,
        attributeNumber.id,
      ],
    });

    const attributesGroupB = await AttributesGroupModel.create({
      ...MOCK_ATTRIBUTES_GROUP_B,
      attributes: [attributeString.id, attributeNumber.id],
    });

    // Rubric types
    const equipmentRubricVariant = await RubricVariantModel.create(MOCK_RUBRIC_TYPE_EQUIPMENT);
    await RubricVariantModel.create(MOCK_RUBRIC_TYPE_STAGE);

    // Rubrics
    const rubricAttributesGroups = [
      {
        showInCatalogueFilter: false,
        node: attributesGroup.id,
      },
    ];

    const rubricAttributesGroupsB = [
      {
        showInCatalogueFilter: false,
        node: attributesGroupB.id,
      },
    ];

    const rubricLevelOne = await RubricModel.create({
      cities: getRubricCities({
        ...MOCK_RUBRIC_LEVEL_ONE,
        slug: generateDefaultLangSlug(MOCK_RUBRIC_LEVEL_ONE.catalogueName),
        variant: equipmentRubricVariant.id,
        attributesGroups: rubricAttributesGroups,
      }),
    });

    const rubricLevelTwo = await RubricModel.create({
      cities: getRubricCities({
        ...MOCK_RUBRIC_LEVEL_TWO,
        slug: generateDefaultLangSlug(MOCK_RUBRIC_LEVEL_TWO.catalogueName),
        parent: rubricLevelOne.id,
        attributesGroups: rubricAttributesGroups,
      }),
    });

    const rubricLevelTwoTables = await RubricModel.create({
      cities: getRubricCities({
        ...MOCK_RUBRIC_LEVEL_TWO_TABLES,
        slug: generateDefaultLangSlug(MOCK_RUBRIC_LEVEL_TWO_TABLES.catalogueName),
        parent: rubricLevelOne.id,
        attributesGroups: rubricAttributesGroupsB,
      }),
    });

    await RubricModel.create({
      cities: getRubricCities({
        ...MOCK_RUBRIC_LEVEL_THREE_TABLES,
        slug: generateDefaultLangSlug(MOCK_RUBRIC_LEVEL_THREE_TABLES.catalogueName),
        parent: rubricLevelTwoTables.id,
        attributesGroups: rubricAttributesGroupsB,
      }),
    });

    await RubricModel.create({
      cities: getRubricCities({
        ...MOCK_RUBRIC_LEVEL_THREE_TABLES_B,
        slug: generateDefaultLangSlug(MOCK_RUBRIC_LEVEL_THREE_TABLES_B.catalogueName),
        parent: rubricLevelTwoTables.id,
        attributesGroups: rubricAttributesGroupsB,
      }),
    });

    const rubricLevelThree = await RubricModel.create({
      cities: getRubricCities({
        ...MOCK_RUBRIC_LEVEL_THREE,
        slug: generateDefaultLangSlug(MOCK_RUBRIC_LEVEL_THREE.catalogueName),
        parent: rubricLevelTwo.id,
        attributesGroups: rubricAttributesGroups,
      }),
    });

    const rubricLevelThreeB = await RubricModel.create({
      cities: getRubricCities({
        ...MOCK_RUBRIC_LEVEL_THREE_B,
        slug: generateDefaultLangSlug(MOCK_RUBRIC_LEVEL_THREE_B.catalogueName),
        parent: rubricLevelTwo.id,
        attributesGroups: rubricAttributesGroups,
      }),
    });

    // Products
    const productAttributes = {
      attributesSource: rubricLevelTwo.id,
      attributesGroups: [
        {
          node: attributesGroup.id,
          showInCard: true,
          attributes: [
            {
              node: attributeMultiple.id,
              showInCard: true,
              key: attributeMultiple.itemId,
              value: optionsIds,
            },
            {
              node: attributeSelect.id,
              showInCard: true,
              key: attributeSelect.itemId,
              value: [optionsIds[0]],
            },
            {
              node: attributeString.id,
              showInCard: true,
              key: attributeString.itemId,
              value: ['string'],
            },
            {
              node: attributeNumber.id,
              showInCard: true,
              key: attributeNumber.itemId,
              value: ['123'],
            },
          ],
        },
      ],
    };

    // for delete
    await ProductModel.create({
      cities: await getProductCities(
        {
          ...MOCK_PRODUCT_FOR_DELETE,
          ...productAttributes,
          rubrics: [rubricLevelThree.id],
        },
        false,
      ),
    });

    // for second rubric in third level
    await ProductModel.create({
      cities: await getProductCities({
        ...MOCK_PRODUCT_B_PRODUCT,
        ...productAttributes,
        rubrics: [rubricLevelThreeB.id],
      }),
    });

    // main product
    // const product = await ProductModel.create({
    await ProductModel.create({
      cities: await getProductCities({
        ...MOCK_PRODUCT,
        ...productAttributes,
        rubrics: [rubricLevelThree.id],
      }),
    });
  } catch (e) {
    console.log('========== createTestData ERROR ==========', '\n', e);
  }
};

export default createTestData;
