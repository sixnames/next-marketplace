import { Rubric, RubricModel } from '../../entities/Rubric';
import { generateDefaultLangSlug } from '../slug';
import { GenderEnum } from '../../entities/commonEntities';
import {
  createTestRubricVariants,
  CreateTestRubricVariantsInterface,
} from './createTestRubricVariants';
import {
  DEFAULT_LANG,
  DEFAULT_PRIORITY,
  GENDER_HE,
  GENDER_IT,
  GENDER_SHE,
  RUBRIC_LEVEL_ONE,
  RUBRIC_LEVEL_THREE,
  RUBRIC_LEVEL_TWO,
  SECONDARY_LANG,
} from '@yagu/shared';
import { Translation } from '../../entities/Translation';
import { fakerEn, fakerRu } from './fakerLocales';

export interface CreateTestRubricsPayloadInterface extends CreateTestRubricVariantsInterface {
  rubricLevelOneADefaultName: string;
  rubricLevelOneAName: Translation[];
  rubricLevelOneA: Rubric;

  rubricLevelOneBDefaultName: string;
  rubricLevelOneBName: Translation[];
  rubricLevelOneB: Rubric;

  rubricLevelOneCDefaultName: string;
  rubricLevelOneCName: Translation[];
  rubricLevelOneC: Rubric;

  rubricLevelOneDDefaultName: string;
  rubricLevelOneDName: Translation[];
  rubricLevelOneD: Rubric;

  rubricLevelTwoADefaultName: string;
  rubricLevelTwoAName: Translation[];
  rubricLevelTwoA: Rubric;

  rubricLevelThreeAADefaultName: string;
  rubricLevelThreeAAName: Translation[];
  rubricLevelThreeAA: Rubric;

  rubricLevelThreeABDefaultName: string;
  rubricLevelThreeABName: Translation[];
  rubricLevelThreeAB: Rubric;

  rubricLevelTwoBDefaultName: string;
  rubricLevelTwoBName: Translation[];
  rubricLevelTwoB: Rubric;

  rubricLevelThreeBADefaultName: string;
  rubricLevelThreeBAName: Translation[];
  rubricLevelThreeBA: Rubric;

  rubricLevelThreeBBDefaultName: string;
  rubricLevelThreeBBName: Translation[];
  rubricLevelThreeBB: Rubric;
}

export const createTestRubrics = async (): Promise<CreateTestRubricsPayloadInterface> => {
  const rubricVariantsPayload = await createTestRubricVariants();
  const {
    attributeWineColor,
    attributeWineVariant,
    attributesGroupOuterRating,
    attributesGroupWineFeatures,
    attributesGroupWhiskeyFeatures,
    rubricVariantAlcohol,
  } = rubricVariantsPayload;

  const rubricAttributesGroups = (isOwner: boolean) => [
    {
      showInCatalogueFilter: [attributeWineColor.id, attributeWineVariant.id],
      showInSiteNav: true,
      node: attributesGroupWineFeatures.id,
      isOwner,
    },
    {
      showInCatalogueFilter: [],
      showInSiteNav: false,
      node: attributesGroupOuterRating.id,
      isOwner,
    },
  ];

  const rubricAttributesGroupsB = (isOwner: boolean) => [
    {
      showInCatalogueFilter: [],
      showInSiteNav: true,
      node: attributesGroupWhiskeyFeatures.id,
      isOwner,
    },
    {
      showInCatalogueFilter: [],
      showInSiteNav: false,
      node: attributesGroupOuterRating.id,
      isOwner,
    },
  ];

  const genderHe = GENDER_HE as GenderEnum;
  const genderShe = GENDER_SHE as GenderEnum;
  const genderIt = GENDER_IT as GenderEnum;

  const rubricLevelOneADefaultName = 'Вино';
  const rubricLevelOneAName = [
    { key: DEFAULT_LANG, value: rubricLevelOneADefaultName },
    { key: SECONDARY_LANG, value: 'Wine' },
  ];
  const rubricLevelOneA = await RubricModel.create({
    name: rubricLevelOneAName,
    catalogueTitle: {
      defaultTitle: [
        { key: DEFAULT_LANG, value: 'Купить вино' },
        { key: SECONDARY_LANG, value: 'Buy a wine' },
      ],
      prefix: [
        { key: DEFAULT_LANG, value: 'Купить' },
        { key: SECONDARY_LANG, value: 'Buy a' },
      ],
      keyword: [
        { key: DEFAULT_LANG, value: 'вино' },
        { key: SECONDARY_LANG, value: 'wine' },
      ],
      gender: genderIt,
    },
    level: RUBRIC_LEVEL_ONE,
    priority: DEFAULT_PRIORITY,
    parent: null,
    views: [],
    priorities: [],
    slug: generateDefaultLangSlug(rubricLevelOneAName),
    variant: rubricVariantAlcohol.id,
    attributesGroups: rubricAttributesGroups(true),
  });

  const rubricLevelOneBDefaultName = 'Шампанское и игристое';
  const rubricLevelOneBName = [
    { key: DEFAULT_LANG, value: rubricLevelOneBDefaultName },
    { key: SECONDARY_LANG, value: 'Champagne' },
  ];
  const rubricLevelOneB = await RubricModel.create({
    name: rubricLevelOneBName,
    catalogueTitle: {
      defaultTitle: [
        { key: DEFAULT_LANG, value: 'Купить шампанское' },
        { key: SECONDARY_LANG, value: 'Buy a champagne' },
      ],
      prefix: [
        { key: DEFAULT_LANG, value: 'Купить' },
        { key: SECONDARY_LANG, value: 'Buy a' },
      ],
      keyword: [
        { key: DEFAULT_LANG, value: 'шампанское' },
        { key: SECONDARY_LANG, value: 'champagne' },
      ],
      gender: genderIt,
    },
    level: RUBRIC_LEVEL_ONE,
    priority: DEFAULT_PRIORITY,
    parent: null,
    views: [],
    priorities: [],
    slug: generateDefaultLangSlug(rubricLevelOneBName),
    variant: rubricVariantAlcohol.id,
    attributesGroups: rubricAttributesGroups(true),
  });

  const rubricLevelOneCDefaultName = 'Виски';
  const rubricLevelOneCName = [
    { key: DEFAULT_LANG, value: rubricLevelOneCDefaultName },
    { key: SECONDARY_LANG, value: 'Whiskey' },
  ];
  const rubricLevelOneC = await RubricModel.create({
    name: rubricLevelOneCName,
    catalogueTitle: {
      defaultTitle: [
        { key: DEFAULT_LANG, value: 'Купить Виски' },
        { key: SECONDARY_LANG, value: 'Buy a Whiskey' },
      ],
      prefix: [
        { key: DEFAULT_LANG, value: 'Купить' },
        { key: SECONDARY_LANG, value: 'Buy a' },
      ],
      keyword: [
        { key: DEFAULT_LANG, value: 'Виски' },
        { key: SECONDARY_LANG, value: 'Whiskey' },
      ],
      gender: genderIt,
    },
    level: RUBRIC_LEVEL_ONE,
    priority: DEFAULT_PRIORITY,
    parent: null,
    views: [],
    priorities: [],
    slug: generateDefaultLangSlug(rubricLevelOneCName),
    variant: rubricVariantAlcohol.id,
    attributesGroups: rubricAttributesGroups(true),
  });

  const rubricLevelOneDDefaultName = 'Коньяк';
  const rubricLevelOneDName = [
    { key: DEFAULT_LANG, value: rubricLevelOneDDefaultName },
    { key: SECONDARY_LANG, value: 'Cognac' },
  ];
  const rubricLevelOneD = await RubricModel.create({
    name: rubricLevelOneDName,
    catalogueTitle: {
      defaultTitle: [
        { key: DEFAULT_LANG, value: 'Купить коньяк' },
        { key: SECONDARY_LANG, value: 'Buy a cognac' },
      ],
      prefix: [
        { key: DEFAULT_LANG, value: 'Купить' },
        { key: SECONDARY_LANG, value: 'Buy a' },
      ],
      keyword: [
        { key: DEFAULT_LANG, value: 'коньяк' },
        { key: SECONDARY_LANG, value: 'cognac' },
      ],
      gender: genderIt,
    },
    level: RUBRIC_LEVEL_ONE,
    priority: DEFAULT_PRIORITY,
    parent: null,
    views: [],
    priorities: [],
    slug: generateDefaultLangSlug(rubricLevelOneDName),
    variant: rubricVariantAlcohol.id,
    attributesGroups: rubricAttributesGroups(true),
  });

  const rubricLevelTwoADefaultName = fakerRu.commerce.department();
  const rubricLevelTwoASecondaryName = fakerRu.commerce.department();
  const rubricLevelTwoAName = [
    { key: DEFAULT_LANG, value: rubricLevelTwoADefaultName },
    { key: SECONDARY_LANG, value: rubricLevelTwoASecondaryName },
  ];
  const rubricLevelTwoA = await RubricModel.create({
    name: rubricLevelTwoAName,
    catalogueTitle: {
      defaultTitle: [
        { key: DEFAULT_LANG, value: rubricLevelTwoADefaultName },
        { key: SECONDARY_LANG, value: rubricLevelTwoASecondaryName },
      ],
      prefix: [],
      keyword: [
        { key: DEFAULT_LANG, value: fakerRu.lorem.word() },
        { key: SECONDARY_LANG, value: fakerEn.lorem.word() },
      ],
      gender: genderShe,
    },
    level: RUBRIC_LEVEL_TWO,
    priority: DEFAULT_PRIORITY,
    views: [],
    priorities: [],
    slug: generateDefaultLangSlug(rubricLevelTwoAName),
    variant: rubricVariantAlcohol.id,
    parent: rubricLevelOneA.id,
    attributesGroups: rubricAttributesGroups(false),
  });

  const rubricLevelThreeAADefaultName = fakerRu.commerce.department();
  const rubricLevelThreeAASecondaryName = fakerRu.commerce.department();
  const rubricLevelThreeAAName = [
    { key: DEFAULT_LANG, value: rubricLevelThreeAADefaultName },
    { key: SECONDARY_LANG, value: rubricLevelThreeAASecondaryName },
  ];
  const rubricLevelThreeAA = await RubricModel.create({
    name: rubricLevelThreeAAName,
    catalogueTitle: {
      defaultTitle: [
        { key: DEFAULT_LANG, value: rubricLevelThreeAADefaultName },
        { key: SECONDARY_LANG, value: rubricLevelThreeAASecondaryName },
      ],
      prefix: [],
      keyword: [
        { key: DEFAULT_LANG, value: fakerRu.lorem.word() },
        { key: SECONDARY_LANG, value: fakerEn.lorem.word() },
      ],
      gender: genderHe,
    },
    level: RUBRIC_LEVEL_THREE,
    priority: DEFAULT_PRIORITY,
    views: [],
    priorities: [],
    slug: generateDefaultLangSlug(rubricLevelThreeAAName),
    variant: rubricVariantAlcohol.id,
    parent: rubricLevelTwoA.id,
    attributesGroups: rubricAttributesGroups(false),
  });

  const rubricLevelThreeABDefaultName = fakerRu.commerce.department();
  const rubricLevelThreeABSecondaryName = fakerRu.commerce.department();
  const rubricLevelThreeABName = [
    { key: DEFAULT_LANG, value: rubricLevelThreeABDefaultName },
    { key: SECONDARY_LANG, value: rubricLevelThreeABSecondaryName },
  ];
  const rubricLevelThreeAB = await RubricModel.create({
    name: rubricLevelThreeABName,
    catalogueTitle: {
      defaultTitle: [
        { key: DEFAULT_LANG, value: rubricLevelThreeABDefaultName },
        { key: SECONDARY_LANG, value: rubricLevelThreeABSecondaryName },
      ],
      prefix: [],
      keyword: [
        { key: DEFAULT_LANG, value: fakerRu.lorem.word() },
        { key: SECONDARY_LANG, value: fakerEn.lorem.word() },
      ],
      gender: genderHe,
    },
    level: RUBRIC_LEVEL_THREE,
    priority: DEFAULT_PRIORITY,
    views: [],
    priorities: [],
    slug: generateDefaultLangSlug(rubricLevelThreeABName),
    variant: rubricVariantAlcohol.id,
    parent: rubricLevelTwoA.id,
    attributesGroups: rubricAttributesGroups(false),
  });

  const rubricLevelTwoBDefaultName = fakerRu.commerce.department();
  const rubricLevelTwoBSecondaryName = fakerRu.commerce.department();
  const rubricLevelTwoBName = [
    { key: DEFAULT_LANG, value: rubricLevelTwoBDefaultName },
    { key: SECONDARY_LANG, value: rubricLevelTwoBSecondaryName },
  ];
  const rubricLevelTwoB = await RubricModel.create({
    name: rubricLevelTwoBName,
    catalogueTitle: {
      defaultTitle: [
        { key: DEFAULT_LANG, value: rubricLevelTwoBDefaultName },
        { key: SECONDARY_LANG, value: rubricLevelTwoBSecondaryName },
      ],
      prefix: [],
      keyword: [
        { key: DEFAULT_LANG, value: fakerRu.lorem.word() },
        { key: SECONDARY_LANG, value: fakerEn.lorem.word() },
      ],
      gender: genderHe,
    },
    level: RUBRIC_LEVEL_TWO,
    priority: DEFAULT_PRIORITY,
    views: [],
    priorities: [],
    slug: generateDefaultLangSlug(rubricLevelTwoBName),
    variant: rubricVariantAlcohol.id,
    parent: rubricLevelOneA.id,
    attributesGroups: [...rubricAttributesGroups(false), ...rubricAttributesGroupsB(true)],
  });

  const rubricLevelThreeBADefaultName = fakerRu.commerce.department();
  const rubricLevelThreeBASecondaryName = fakerRu.commerce.department();
  const rubricLevelThreeBAName = [
    { key: DEFAULT_LANG, value: rubricLevelThreeBADefaultName },
    { key: SECONDARY_LANG, value: rubricLevelThreeBASecondaryName },
  ];
  const rubricLevelThreeBA = await RubricModel.create({
    name: rubricLevelThreeBAName,
    catalogueTitle: {
      defaultTitle: [
        { key: DEFAULT_LANG, value: rubricLevelThreeBADefaultName },
        { key: SECONDARY_LANG, value: rubricLevelThreeBASecondaryName },
      ],
      prefix: [],
      keyword: [
        { key: DEFAULT_LANG, value: fakerRu.lorem.word() },
        { key: SECONDARY_LANG, value: fakerEn.lorem.word() },
      ],
      gender: genderIt,
    },
    level: RUBRIC_LEVEL_THREE,
    priority: DEFAULT_PRIORITY,
    views: [],
    priorities: [],
    slug: generateDefaultLangSlug(rubricLevelThreeBAName),
    variant: rubricVariantAlcohol.id,
    parent: rubricLevelTwoB.id,
    attributesGroups: [...rubricAttributesGroups(false), ...rubricAttributesGroupsB(false)],
  });

  const rubricLevelThreeBBDefaultName = fakerRu.commerce.department();
  const rubricLevelThreeBBSecondaryName = fakerRu.commerce.department();
  const rubricLevelThreeBBName = [
    { key: DEFAULT_LANG, value: rubricLevelThreeBBDefaultName },
    { key: SECONDARY_LANG, value: rubricLevelThreeBBSecondaryName },
  ];
  const rubricLevelThreeBB = await RubricModel.create({
    name: rubricLevelThreeBBName,
    catalogueTitle: {
      defaultTitle: [
        { key: DEFAULT_LANG, value: rubricLevelThreeBBDefaultName },
        { key: SECONDARY_LANG, value: rubricLevelThreeBBSecondaryName },
      ],
      prefix: [],
      keyword: [
        { key: DEFAULT_LANG, value: fakerRu.lorem.word() },
        { key: SECONDARY_LANG, value: fakerEn.lorem.word() },
      ],
      gender: genderIt,
    },
    level: RUBRIC_LEVEL_THREE,
    priority: DEFAULT_PRIORITY,
    views: [],
    priorities: [],
    slug: generateDefaultLangSlug(rubricLevelThreeBBName),
    variant: rubricVariantAlcohol.id,
    parent: rubricLevelTwoB.id,
    attributesGroups: [...rubricAttributesGroups(false), ...rubricAttributesGroupsB(false)],
  });

  return {
    ...rubricVariantsPayload,
    rubricLevelOneADefaultName,
    rubricLevelOneAName,
    rubricLevelOneA,

    rubricLevelOneBDefaultName,
    rubricLevelOneBName,
    rubricLevelOneB,

    rubricLevelOneCDefaultName,
    rubricLevelOneCName,
    rubricLevelOneC,

    rubricLevelOneDDefaultName,
    rubricLevelOneDName,
    rubricLevelOneD,

    rubricLevelTwoADefaultName,
    rubricLevelTwoAName,
    rubricLevelTwoA,

    rubricLevelThreeAADefaultName,
    rubricLevelThreeAAName,
    rubricLevelThreeAA,

    rubricLevelThreeABDefaultName,
    rubricLevelThreeABName,
    rubricLevelThreeAB,

    rubricLevelTwoBDefaultName,
    rubricLevelTwoBName,
    rubricLevelTwoB,

    rubricLevelThreeBADefaultName,
    rubricLevelThreeBAName,
    rubricLevelThreeBA,

    rubricLevelThreeBBDefaultName,
    rubricLevelThreeBBName,
    rubricLevelThreeBB,
  };
};
