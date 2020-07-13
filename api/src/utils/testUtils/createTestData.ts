import { clearTestDataHandler } from './clearTestData';
import createInitialData from '../createInitialData';
import { OptionModel } from '../../entities/Option';
import { OptionsGroupModel } from '../../entities/OptionsGroup';
import {
  AttributeModel,
  AttributePositionInTitleEnum,
  AttributeVariantEnum,
} from '../../entities/Attribute';
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
  MOCK_ATTRIBUTES_GROUP_WINE_FEATURES,
  MOCK_ATTRIBUTES_GROUP_WHISKEY_FEATURES,
  MOCK_ATTRIBUTES_GROUP_FOR_DELETE,
  MOCK_OPTIONS_WINE_COLOR,
  MOCK_OPTIONS_GROUP_COLORS,
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
  MOCK_RUBRIC_TYPE_ALCOHOL,
  MOCK_RUBRIC_TYPE_JUICE,
  DEFAULT_LANG,
  ATTRIBUTE_POSITION_IN_TITLE_BEFORE_KEYWORD,
  SECONDARY_LANG,
  ATTRIBUTE_POSITION_IN_TITLE_REPLACE_KEYWORD,
} from '../../config';
import { ProductCity, ProductModel } from '../../entities/Product';
import { Types } from 'mongoose';
import sharp from 'sharp';
import fs from 'fs';
import mkdirp from 'mkdirp';
import { GenderEnum } from '../../entities/common';

interface LangInterface {
  key: string;
  value: string;
}

interface GetRubricCitiesInterface {
  name: LangInterface[];
  catalogueName: LangInterface[];
  level: number;
  slug: string;
  gender: GenderEnum;
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
    const optionsColor = await OptionModel.insertMany(MOCK_OPTIONS_WINE_COLOR);
    const optionsWineType = await OptionModel.insertMany(MOCK_OPTIONS_WINE_TYPE);
    const optionsIdsColor = optionsColor.map(({ id }) => id);
    const optionsIdsWineType = optionsWineType.map(({ id }) => id);

    const optionsSlugsColor = optionsColor.map(({ slug }) => slug);
    const optionsSlugsWineType = optionsWineType.map(({ slug }) => slug);

    const optionsGroupWineTypes = await OptionsGroupModel.create({
      ...MOCK_OPTIONS_GROUP_WINE_TYPES,
      options: optionsIdsWineType,
    });

    const optionsGroupColors = await OptionsGroupModel.create({
      ...MOCK_OPTIONS_GROUP_COLORS,
      options: optionsIdsColor,
    });

    // Attributes
    const attributeWineColor = await AttributeModel.create({
      ...MOCK_ATTRIBUTE_WINE_COLOR,
      variant: MOCK_ATTRIBUTE_WINE_COLOR.variant as AttributeVariantEnum,
      options: optionsGroupColors.id,
      positioningInTitle: [
        {
          key: DEFAULT_LANG,
          value: ATTRIBUTE_POSITION_IN_TITLE_BEFORE_KEYWORD as AttributePositionInTitleEnum,
        },
        {
          key: SECONDARY_LANG,
          value: ATTRIBUTE_POSITION_IN_TITLE_BEFORE_KEYWORD as AttributePositionInTitleEnum,
        },
      ],
    });

    const attributeWineType = await AttributeModel.create({
      ...MOCK_ATTRIBUTE_WINE_TYPE,
      variant: MOCK_ATTRIBUTE_WINE_TYPE.variant as AttributeVariantEnum,
      options: optionsGroupWineTypes.id,
      positioningInTitle: [
        {
          key: DEFAULT_LANG,
          value: ATTRIBUTE_POSITION_IN_TITLE_REPLACE_KEYWORD as AttributePositionInTitleEnum,
        },
        {
          key: SECONDARY_LANG,
          value: ATTRIBUTE_POSITION_IN_TITLE_REPLACE_KEYWORD as AttributePositionInTitleEnum,
        },
      ],
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
        attributeWineColor.id,
        attributeWineType.id,
        attributeString.id,
        attributeNumber.id,
      ],
    });

    const attributesGroupWineFeatures = await AttributesGroupModel.create({
      ...MOCK_ATTRIBUTES_GROUP_WINE_FEATURES,
      attributes: [
        attributeWineColor.id,
        attributeWineType.id,
        attributeString.id,
        attributeNumber.id,
      ],
    });

    const attributesGroupWhiskeyFeatures = await AttributesGroupModel.create({
      ...MOCK_ATTRIBUTES_GROUP_WHISKEY_FEATURES,
      attributes: [attributeString.id, attributeNumber.id],
    });

    // Rubric types
    const rubricVariantAlcohol = await RubricVariantModel.create(MOCK_RUBRIC_TYPE_ALCOHOL);
    await RubricVariantModel.create(MOCK_RUBRIC_TYPE_JUICE);

    // Rubrics
    const rubricAttributesGroups = (isOwner: boolean) => [
      {
        showInCatalogueFilter: [attributeWineColor.id, attributeWineType.id],
        node: attributesGroupWineFeatures.id,
        isOwner,
      },
    ];

    const rubricAttributesGroupsB = (isOwner: boolean) => [
      {
        showInCatalogueFilter: [],
        node: attributesGroupWhiskeyFeatures.id,
        isOwner,
      },
    ];

    const rubricLevelOne = await RubricModel.create({
      cities: getRubricCities({
        ...MOCK_RUBRIC_LEVEL_ONE,
        slug: generateDefaultLangSlug(MOCK_RUBRIC_LEVEL_ONE.catalogueName),
        variant: rubricVariantAlcohol.id,
        attributesGroups: rubricAttributesGroups(true),
        gender: MOCK_RUBRIC_LEVEL_ONE.gender as GenderEnum,
      }),
    });

    const rubricLevelTwoA = await RubricModel.create({
      cities: getRubricCities({
        ...MOCK_RUBRIC_LEVEL_TWO_A,
        slug: generateDefaultLangSlug(MOCK_RUBRIC_LEVEL_TWO_A.catalogueName),
        parent: rubricLevelOne.id,
        attributesGroups: rubricAttributesGroups(false),
        gender: MOCK_RUBRIC_LEVEL_TWO_A.gender as GenderEnum,
      }),
    });

    const rubricLevelThreeAA = await RubricModel.create({
      cities: getRubricCities({
        ...MOCK_RUBRIC_LEVEL_THREE_A_A,
        slug: generateDefaultLangSlug(MOCK_RUBRIC_LEVEL_THREE_A_A.catalogueName),
        parent: rubricLevelTwoA.id,
        attributesGroups: rubricAttributesGroups(false),
        gender: MOCK_RUBRIC_LEVEL_THREE_A_A.gender as GenderEnum,
      }),
    });

    const rubricLevelThreeAB = await RubricModel.create({
      cities: getRubricCities({
        ...MOCK_RUBRIC_LEVEL_THREE_A_B,
        slug: generateDefaultLangSlug(MOCK_RUBRIC_LEVEL_THREE_A_B.catalogueName),
        parent: rubricLevelTwoA.id,
        attributesGroups: rubricAttributesGroups(false),
        gender: MOCK_RUBRIC_LEVEL_THREE_A_B.gender as GenderEnum,
      }),
    });

    const rubricLevelTwoB = await RubricModel.create({
      cities: getRubricCities({
        ...MOCK_RUBRIC_LEVEL_TWO_B,
        slug: generateDefaultLangSlug(MOCK_RUBRIC_LEVEL_TWO_B.catalogueName),
        parent: rubricLevelOne.id,
        attributesGroups: [...rubricAttributesGroups(false), ...rubricAttributesGroupsB(true)],
        gender: MOCK_RUBRIC_LEVEL_TWO_B.gender as GenderEnum,
      }),
    });

    await RubricModel.create({
      cities: getRubricCities({
        ...MOCK_RUBRIC_LEVEL_THREE_B_A,
        slug: generateDefaultLangSlug(MOCK_RUBRIC_LEVEL_THREE_B_A.catalogueName),
        parent: rubricLevelTwoB.id,
        attributesGroups: [...rubricAttributesGroups(false), ...rubricAttributesGroupsB(false)],
        gender: MOCK_RUBRIC_LEVEL_THREE_B_A.gender as GenderEnum,
      }),
    });

    await RubricModel.create({
      cities: getRubricCities({
        ...MOCK_RUBRIC_LEVEL_THREE_B_B,
        slug: generateDefaultLangSlug(MOCK_RUBRIC_LEVEL_THREE_B_B.catalogueName),
        parent: rubricLevelTwoB.id,
        attributesGroups: [...rubricAttributesGroups(false), ...rubricAttributesGroupsB(false)],
        gender: MOCK_RUBRIC_LEVEL_THREE_B_B.gender as GenderEnum,
      }),
    });

    // Products
    const productAttributes = (wineColorOptions: string, wineTypeOptions: string) => ({
      attributesGroups: [
        {
          node: attributesGroupWineFeatures.id,
          showInCard: true,
          attributes: [
            {
              node: attributeWineColor.id,
              showInCard: true,
              key: attributeWineColor.slug,
              value: [wineColorOptions],
            },
            {
              node: attributeWineType.id,
              showInCard: true,
              key: attributeWineType.slug,
              value: [wineTypeOptions],
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
          ...productAttributes(optionsSlugsColor[2], optionsSlugsWineType[2]),
          rubrics: [rubricLevelThreeAA.id],
        },
        false,
      ),
    });

    // for second rubric in third level
    await ProductModel.create({
      cities: await getProductCities({
        ...MOCK_PRODUCT_C,
        ...productAttributes(optionsSlugsColor[0], optionsSlugsWineType[0]),
        rubrics: [rubricLevelThreeAB.id],
      }),
    });

    // main product
    // const product = await ProductModel.create({
    await ProductModel.create({
      cities: await getProductCities({
        ...MOCK_PRODUCT_A,
        ...productAttributes(optionsSlugsColor[1], optionsSlugsWineType[1]),
        rubrics: [rubricLevelThreeAA.id],
      }),
    });
  } catch (e) {
    console.log('========== createTestData ERROR ==========', '\n', e);
  }
};

export default createTestData;
