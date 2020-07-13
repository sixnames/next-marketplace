import { clearTestDataHandler } from './clearTestData';
import createInitialData from '../createInitialData';
import { OptionModel } from '../../entities/Option';
import { OptionsGroupModel } from '../../entities/OptionsGroup';
import { AttributeModel, AttributeVariantEnum } from '../../entities/Attribute';
import { AttributesGroupModel } from '../../entities/AttributesGroup';
import { generateDefaultLangSlug } from '../slug';
import { RubricVariantModel } from '../../entities/RubricVariant';
import { RubricModel } from '../../entities/Rubric';
import {
  DEFAULT_CITY,
  MOCK_ATTRIBUTE_WINE_COLOR,
  MOCK_ATTRIBUTE_NUMBER,
  MOCK_ATTRIBUTE_WINE_TYPE,
  MOCK_ATTRIBUTE_STRING,
  MOCK_ATTRIBUTES_GROUP,
  MOCK_ATTRIBUTES_GROUP_B,
  MOCK_ATTRIBUTES_GROUP_FOR_DELETE,
  MOCK_OPTIONS_WINE_COLOR,
  MOCK_OPTIONS_GROUP,
  MOCK_OPTIONS_GROUP_WINE_TYPES,
  MOCK_OPTIONS_WINE_TYPE,
  MOCK_PRODUCT_A,
  MOCK_PRODUCT_C,
  MOCK_PRODUCT_B,
  MOCK_RUBRIC_LEVEL_ONE,
  MOCK_RUBRIC_LEVEL_THREE_A_A,
  MOCK_RUBRIC_LEVEL_THREE_A_B,
  MOCK_RUBRIC_LEVEL_THREE_B_A,
  MOCK_RUBRIC_LEVEL_THREE_B_B,
  MOCK_RUBRIC_LEVEL_TWO_A,
  MOCK_RUBRIC_LEVEL_TWO_B,
  MOCK_RUBRIC_TYPE_EQUIPMENT,
  MOCK_RUBRIC_TYPE_STAGE,
} from '../../config';
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
    showInCatalogueFilter: string[];
    node: string;
    isOwner: boolean;
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
  attributesGroups: {
    showInCard: boolean;
    node: string;
    attributes: {
      showInCard: boolean;
      node: string;
      key: string;
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

const createTestData = async () => {
  try {
    // Clear old test data
    await clearTestDataHandler();

    // Metrics and admin user
    await createInitialData();

    // Options
    const options = await OptionModel.insertMany(MOCK_OPTIONS_WINE_COLOR);
    const optionsWineType = await OptionModel.insertMany(MOCK_OPTIONS_WINE_TYPE);
    const optionsIds = options.map(({ id }) => id);
    const optionsIdsWineType = optionsWineType.map(({ id }) => id);
    const optionsSlugs = options.map(({ slug }) => slug);

    const optionsGroupWineTypes = await OptionsGroupModel.create({
      ...MOCK_OPTIONS_GROUP_WINE_TYPES,
      options: optionsIdsWineType,
    });
    const optionsGroup = await OptionsGroupModel.create({
      ...MOCK_OPTIONS_GROUP,
      options: optionsIds,
    });

    // Attributes
    const attributeMultiple = await AttributeModel.create({
      ...MOCK_ATTRIBUTE_WINE_COLOR,
      variant: MOCK_ATTRIBUTE_WINE_COLOR.variant as AttributeVariantEnum,
      options: optionsGroup.id,
    });

    const attributeSelect = await AttributeModel.create({
      ...MOCK_ATTRIBUTE_WINE_TYPE,
      variant: MOCK_ATTRIBUTE_WINE_TYPE.variant as AttributeVariantEnum,
      options: optionsGroup.id,
    });

    const attributeString = await AttributeModel.create({
      ...MOCK_ATTRIBUTE_STRING,
      variant: MOCK_ATTRIBUTE_STRING.variant as AttributeVariantEnum,
    });

    const attributeNumber = await AttributeModel.create({
      ...MOCK_ATTRIBUTE_NUMBER,
      variant: MOCK_ATTRIBUTE_NUMBER.variant as AttributeVariantEnum,
    });

    await AttributesGroupModel.create({
      ...MOCK_ATTRIBUTES_GROUP_FOR_DELETE,
      attributes: [
        attributeMultiple.id,
        attributeSelect.id,
        attributeString.id,
        attributeNumber.id,
      ],
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
    const rubricAttributesGroups = (isOwner: boolean) => [
      {
        showInCatalogueFilter: [attributeMultiple.id, attributeSelect.id],
        node: attributesGroup.id,
        isOwner,
      },
    ];

    const rubricAttributesGroupsB = (isOwner: boolean) => [
      {
        showInCatalogueFilter: [],
        node: attributesGroupB.id,
        isOwner,
      },
    ];

    const rubricLevelOne = await RubricModel.create({
      cities: getRubricCities({
        ...MOCK_RUBRIC_LEVEL_ONE,
        slug: generateDefaultLangSlug(MOCK_RUBRIC_LEVEL_ONE.catalogueName),
        variant: equipmentRubricVariant.id,
        attributesGroups: rubricAttributesGroups(true),
      }),
    });

    const rubricLevelTwo = await RubricModel.create({
      cities: getRubricCities({
        ...MOCK_RUBRIC_LEVEL_TWO_A,
        slug: generateDefaultLangSlug(MOCK_RUBRIC_LEVEL_TWO_A.catalogueName),
        parent: rubricLevelOne.id,
        attributesGroups: rubricAttributesGroups(false),
      }),
    });

    const rubricLevelTwoTables = await RubricModel.create({
      cities: getRubricCities({
        ...MOCK_RUBRIC_LEVEL_TWO_B,
        slug: generateDefaultLangSlug(MOCK_RUBRIC_LEVEL_TWO_B.catalogueName),
        parent: rubricLevelOne.id,
        attributesGroups: [...rubricAttributesGroups(false), ...rubricAttributesGroupsB(true)],
      }),
    });

    await RubricModel.create({
      cities: getRubricCities({
        ...MOCK_RUBRIC_LEVEL_THREE_B_A,
        slug: generateDefaultLangSlug(MOCK_RUBRIC_LEVEL_THREE_B_A.catalogueName),
        parent: rubricLevelTwoTables.id,
        attributesGroups: [...rubricAttributesGroups(false), ...rubricAttributesGroupsB(false)],
      }),
    });

    await RubricModel.create({
      cities: getRubricCities({
        ...MOCK_RUBRIC_LEVEL_THREE_B_B,
        slug: generateDefaultLangSlug(MOCK_RUBRIC_LEVEL_THREE_B_B.catalogueName),
        parent: rubricLevelTwoTables.id,
        attributesGroups: [...rubricAttributesGroups(false), ...rubricAttributesGroupsB(false)],
      }),
    });

    const rubricLevelThree = await RubricModel.create({
      cities: getRubricCities({
        ...MOCK_RUBRIC_LEVEL_THREE_A_A,
        slug: generateDefaultLangSlug(MOCK_RUBRIC_LEVEL_THREE_A_A.catalogueName),
        parent: rubricLevelTwo.id,
        attributesGroups: rubricAttributesGroups(false),
      }),
    });

    const rubricLevelThreeB = await RubricModel.create({
      cities: getRubricCities({
        ...MOCK_RUBRIC_LEVEL_THREE_A_B,
        slug: generateDefaultLangSlug(MOCK_RUBRIC_LEVEL_THREE_A_B.catalogueName),
        parent: rubricLevelTwo.id,
        attributesGroups: rubricAttributesGroups(false),
      }),
    });

    // Products
    const productAttributes = (
      multipleAttributeOptions: string,
      selectAttributeOptions: string,
    ) => ({
      attributesGroups: [
        {
          node: attributesGroup.id,
          showInCard: true,
          attributes: [
            {
              node: attributeMultiple.id,
              showInCard: true,
              key: attributeMultiple.slug,
              value: [multipleAttributeOptions],
            },
            {
              node: attributeSelect.id,
              showInCard: true,
              key: attributeSelect.slug,
              value: [selectAttributeOptions],
            },
            {
              node: attributeString.id,
              showInCard: true,
              key: attributeString.slug,
              value: ['string'],
            },
            {
              node: attributeNumber.id,
              showInCard: true,
              key: attributeNumber.slug,
              value: ['123'],
            },
          ],
        },
      ],
    });

    // for delete
    await ProductModel.create({
      cities: await getProductCities(
        {
          ...MOCK_PRODUCT_B,
          ...productAttributes(optionsSlugs[2], optionsSlugs[2]),
          rubrics: [rubricLevelThree.id],
        },
        false,
      ),
    });

    // for second rubric in third level
    await ProductModel.create({
      cities: await getProductCities({
        ...MOCK_PRODUCT_C,
        ...productAttributes(optionsSlugs[0], optionsSlugs[0]),
        rubrics: [rubricLevelThreeB.id],
      }),
    });

    // main product
    // const product = await ProductModel.create({
    await ProductModel.create({
      cities: await getProductCities({
        ...MOCK_PRODUCT_A,
        ...productAttributes(optionsSlugs[1], optionsSlugs[1]),
        rubrics: [rubricLevelThree.id],
      }),
    });
  } catch (e) {
    console.log('========== createTestData ERROR ==========', '\n', e);
  }
};

export default createTestData;
