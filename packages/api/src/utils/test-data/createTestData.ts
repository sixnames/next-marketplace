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
  // MOCK_PRODUCT,
  // MOCK_PRODUCT_FOR_DELETE,
  // MOCK_PRODUCT_B_PRODUCT,
  // PRODUCT_IMAGE_SIZES,
  // MOCK_PRODUCT_IMAGES,
} from '@rg/config';
// import { generateSlug } from '../slug';
// import { storeTestAssets } from '../assets/storeJimpAsset';
import createInitialData from '../createInitialData';
import { OptionModel } from '../../entities/Option';
import { OptionsGroupModel } from '../../entities/OptionsGroup';
import { AttributeModel } from '../../entities/Attribute';
import { AttributesGroupModel } from '../../entities/AttributesGroup';
import { generateSlug } from '../slug';
import { RubricVariantModel } from '../../entities/RubricVariant';
import { RubricModel } from '../../entities/Rubric';
import { DEFAULT_CITY, DEFAULT_LANG } from '../../config';

interface GetRubricCitiesInterface {
  name: string;
  catalogueName: string;
  level: number;
  slug: string;
  variant?: string;
  parent?: string | null;
  attributesGroups: {
    showInCatalogueFilter: boolean;
    node: string;
  }[];
}

function getRubricCities(node: GetRubricCitiesInterface) {
  return [
    {
      key: DEFAULT_CITY,
      lang: [
        {
          key: DEFAULT_LANG,
          node,
        },
      ],
    },
  ];
}

const createTestData = async () => {
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
  const attributeMultipleSlug = generateSlug(MOCK_ATTRIBUTE_MULTIPLE.name);
  const attributeMultiple = await AttributeModel.create({
    ...MOCK_ATTRIBUTE_MULTIPLE,
    slug: attributeMultipleSlug,
    options: optionsGroup.id,
  });

  const attributeSelectSlug = generateSlug(MOCK_ATTRIBUTE_SELECT.name);
  const attributeSelect = await AttributeModel.create({
    ...MOCK_ATTRIBUTE_SELECT,
    slug: attributeSelectSlug,
    options: optionsGroup.id,
  });

  const attributeStringSlug = generateSlug(MOCK_ATTRIBUTE_STRING.name);
  const attributeString = await AttributeModel.create({
    ...MOCK_ATTRIBUTE_STRING,
    slug: attributeStringSlug,
    options: optionsGroup.id,
  });

  const attributeNumberSlug = generateSlug(MOCK_ATTRIBUTE_NUMBER.name);
  const attributeNumber = await AttributeModel.create({
    ...MOCK_ATTRIBUTE_NUMBER,
    slug: attributeNumberSlug,
    options: optionsGroup.id,
  });

  await AttributesGroupModel.create(MOCK_ATTRIBUTES_GROUP_FOR_DELETE);
  const attributesGroup = await AttributesGroupModel.create({
    ...MOCK_ATTRIBUTES_GROUP,
    attributes: [attributeMultiple.id, attributeSelect.id, attributeString.id, attributeNumber.id],
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
      slug: generateSlug(MOCK_RUBRIC_LEVEL_ONE.catalogueName),
      variant: equipmentRubricVariant.id,
      attributesGroups: rubricAttributesGroups,
    }),
  });

  const rubricLevelTwo = await RubricModel.create({
    cities: getRubricCities({
      ...MOCK_RUBRIC_LEVEL_TWO,
      slug: generateSlug(MOCK_RUBRIC_LEVEL_TWO.catalogueName),
      parent: rubricLevelOne.id,
      attributesGroups: rubricAttributesGroups,
    }),
  });

  const rubricLevelTwoTables = await RubricModel.create({
    cities: getRubricCities({
      ...MOCK_RUBRIC_LEVEL_TWO_TABLES,
      slug: generateSlug(MOCK_RUBRIC_LEVEL_TWO_TABLES.catalogueName),
      parent: rubricLevelOne.id,
      attributesGroups: rubricAttributesGroupsB,
    }),
  });

  await RubricModel.create({
    cities: getRubricCities({
      ...MOCK_RUBRIC_LEVEL_THREE_TABLES,
      slug: generateSlug(MOCK_RUBRIC_LEVEL_THREE_TABLES.catalogueName),
      parent: rubricLevelTwoTables.id,
      attributesGroups: rubricAttributesGroupsB,
    }),
  });

  await RubricModel.create({
    cities: getRubricCities({
      ...MOCK_RUBRIC_LEVEL_THREE_TABLES_B,
      slug: generateSlug(MOCK_RUBRIC_LEVEL_THREE_TABLES_B.catalogueName),
      parent: rubricLevelTwoTables.id,
      attributesGroups: rubricAttributesGroupsB,
    }),
  });

  // const rubricLevelThree = await RubricModel.create({
  await RubricModel.create({
    cities: getRubricCities({
      ...MOCK_RUBRIC_LEVEL_THREE,
      slug: generateSlug(MOCK_RUBRIC_LEVEL_THREE.catalogueName),
      parent: rubricLevelTwo.id,
      attributesGroups: rubricAttributesGroups,
    }),
  });

  // const rubricLevelThreeB = await RubricModel.create({
  await RubricModel.create({
    cities: getRubricCities({
      ...MOCK_RUBRIC_LEVEL_THREE_B,
      slug: generateSlug(MOCK_RUBRIC_LEVEL_THREE_B.catalogueName),
      parent: rubricLevelTwo.id,
      attributesGroups: rubricAttributesGroups,
    }),
  });

  // Products
  // for delete
  /*const productAttributes = {
    attributesSource: rubricLevelTwo.id,
    attributesGroups: [
      {
        source: attributesGroup.id,
        showInCard: true,
        attributes: [
          {
            source: attributeMultiple.id,
            showInCard: true,
            value: {
              [attributeMultipleSlug]: optionsIds,
            },
          },
          {
            source: attributeSelect.id,
            showInCard: true,
            value: {
              [attributeSelectSlug]: optionsIds,
            },
          },
          {
            source: attributeString.id,
            showInCard: true,
            value: {
              [attributeStringSlug]: ['string'],
            },
          },
          {
            source: attributeNumber.id,
            showInCard: true,
            value: {
              [attributeNumberSlug]: [123],
            },
          },
        ],
      },
    ],
  };

  const productImagesA = ['./test/test-image-0.jpg', './test/test-image-1.jpg'];
  const linkProductForDelete = generateSlug(MOCK_PRODUCT_FOR_DELETE.cardName);
  const imagesProductForDelete = await storeTestAssets({
    urls: productImagesA,
    sizes: PRODUCT_IMAGE_SIZES,
    slug: linkProductForDelete,
  });

  await Product.create({
    ...MOCK_PRODUCT_FOR_DELETE,
    ...productAttributes,
    slug: linkProductForDelete,
    rubrics: [rubricLevelThree.id],
    assets: imagesProductForDelete,
  });

  // for second rubric in third level
  const linkProductBDelete = generateSlug(MOCK_PRODUCT_B_PRODUCT.cardName);
  const productImagesB = ['./test/test-image-1.jpg', './test/test-image-0.jpg'];
  const imagesProductBDelete = await storeTestAssets({
    urls: productImagesB,
    sizes: PRODUCT_IMAGE_SIZES,
    slug: linkProductBDelete,
  });

  await Product.create({
    ...MOCK_PRODUCT_B_PRODUCT,
    ...productAttributes,
    slug: linkProductBDelete,
    rubrics: [rubricLevelThreeB.id],
    assets: imagesProductBDelete,
  });

  // main product
  const slug = generateSlug(MOCK_PRODUCT.cardName);
  const productImagesC = ['./test/test-image-2.jpg', './test/test-image-1.jpg'];
  const imagesProduct = await storeTestAssets({
    urls: productImagesC,
    sizes: PRODUCT_IMAGE_SIZES,
    slug,
  });

  // const product = await Product.create({
  await Product.create({
    ...MOCK_PRODUCT,
    ...productAttributes,
    slug,
    rubrics: [rubricLevelThree.id],
    assets: imagesProduct,
  });*/
  // console.log(product);
};

export default createTestData;
