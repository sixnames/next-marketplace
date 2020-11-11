import { Rubric, RubricModel } from '../../entities/Rubric';
import {
  MOCK_RUBRIC_LEVEL_ONE,
  MOCK_RUBRIC_LEVEL_ONE_B,
  MOCK_RUBRIC_LEVEL_ONE_C,
  MOCK_RUBRIC_LEVEL_ONE_D,
  MOCK_RUBRIC_LEVEL_THREE_A_A,
  MOCK_RUBRIC_LEVEL_THREE_A_B,
  MOCK_RUBRIC_LEVEL_THREE_B_A,
  MOCK_RUBRIC_LEVEL_THREE_B_B,
  MOCK_RUBRIC_LEVEL_TWO_A,
  MOCK_RUBRIC_LEVEL_TWO_B,
} from '@yagu/mocks';
import { generateDefaultLangSlug } from '../slug';
import { GenderEnum } from '../../entities/common';
import { CreateTestAttributesPayloadInterface } from './createTestAttributes';
import { CreateTestRubricVariantsInterface } from './createTestRubricVariants';

interface CreateTestRubricsInterface
  extends CreateTestAttributesPayloadInterface,
    CreateTestRubricVariantsInterface {}

export interface CreateTestRubricsPayloadInterface {
  rubricLevelOneA: Rubric;
  rubricLevelOneB: Rubric;
  rubricLevelOneC: Rubric;
  rubricLevelOneD: Rubric;
  rubricLevelTwoA: Rubric;
  rubricLevelThreeAA: Rubric;
  rubricLevelThreeAB: Rubric;
  rubricLevelTwoB: Rubric;
  rubricLevelThreeBA: Rubric;
  rubricLevelThreeBB: Rubric;
}

export const createTestRubrics = async ({
  attributeWineColor,
  attributeWineType,
  attributesGroupOuterRating,
  attributesGroupWineFeatures,
  attributesGroupWhiskeyFeatures,
  rubricVariantAlcohol,
}: CreateTestRubricsInterface): Promise<CreateTestRubricsPayloadInterface> => {
  const rubricAttributesGroups = (isOwner: boolean) => [
    {
      showInCatalogueFilter: [attributeWineColor.id, attributeWineType.id],
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

  const rubricLevelOneA = await RubricModel.create({
    ...MOCK_RUBRIC_LEVEL_ONE,
    views: [],
    priorities: [],
    slug: generateDefaultLangSlug(MOCK_RUBRIC_LEVEL_ONE.catalogueTitle.defaultTitle),
    variant: rubricVariantAlcohol.id,
    attributesGroups: rubricAttributesGroups(true),
    catalogueTitle: {
      ...MOCK_RUBRIC_LEVEL_ONE.catalogueTitle,
      gender: MOCK_RUBRIC_LEVEL_ONE.catalogueTitle.gender as GenderEnum,
    },
  });

  const rubricLevelOneB = await RubricModel.create({
    ...MOCK_RUBRIC_LEVEL_ONE_B,
    views: [],
    priorities: [],
    slug: generateDefaultLangSlug(MOCK_RUBRIC_LEVEL_ONE_B.catalogueTitle.defaultTitle),
    variant: rubricVariantAlcohol.id,
    attributesGroups: rubricAttributesGroups(true),
    catalogueTitle: {
      ...MOCK_RUBRIC_LEVEL_ONE_B.catalogueTitle,
      gender: MOCK_RUBRIC_LEVEL_ONE_B.catalogueTitle.gender as GenderEnum,
    },
  });

  const rubricLevelOneC = await RubricModel.create({
    ...MOCK_RUBRIC_LEVEL_ONE_C,
    views: [],
    priorities: [],
    slug: generateDefaultLangSlug(MOCK_RUBRIC_LEVEL_ONE_C.catalogueTitle.defaultTitle),
    variant: rubricVariantAlcohol.id,
    attributesGroups: rubricAttributesGroups(true),
    catalogueTitle: {
      ...MOCK_RUBRIC_LEVEL_ONE_C.catalogueTitle,
      gender: MOCK_RUBRIC_LEVEL_ONE_C.catalogueTitle.gender as GenderEnum,
    },
  });

  const rubricLevelOneD = await RubricModel.create({
    ...MOCK_RUBRIC_LEVEL_ONE_D,
    views: [],
    priorities: [],
    slug: generateDefaultLangSlug(MOCK_RUBRIC_LEVEL_ONE_D.catalogueTitle.defaultTitle),
    variant: rubricVariantAlcohol.id,
    attributesGroups: rubricAttributesGroups(true),
    catalogueTitle: {
      ...MOCK_RUBRIC_LEVEL_ONE_D.catalogueTitle,
      gender: MOCK_RUBRIC_LEVEL_ONE_D.catalogueTitle.gender as GenderEnum,
    },
  });

  const rubricLevelTwoA = await RubricModel.create({
    ...MOCK_RUBRIC_LEVEL_TWO_A,
    views: [],
    priorities: [],
    slug: generateDefaultLangSlug(MOCK_RUBRIC_LEVEL_TWO_A.catalogueTitle.defaultTitle),
    variant: rubricVariantAlcohol.id,
    parent: rubricLevelOneA.id,
    attributesGroups: rubricAttributesGroups(false),
    catalogueTitle: {
      ...MOCK_RUBRIC_LEVEL_TWO_A.catalogueTitle,
      gender: MOCK_RUBRIC_LEVEL_TWO_A.catalogueTitle.gender as GenderEnum,
    },
  });

  const rubricLevelThreeAA = await RubricModel.create({
    ...MOCK_RUBRIC_LEVEL_THREE_A_A,
    views: [],
    priorities: [],
    slug: generateDefaultLangSlug(MOCK_RUBRIC_LEVEL_THREE_A_A.catalogueTitle.defaultTitle),
    variant: rubricVariantAlcohol.id,
    parent: rubricLevelTwoA.id,
    attributesGroups: rubricAttributesGroups(false),
    catalogueTitle: {
      ...MOCK_RUBRIC_LEVEL_THREE_A_A.catalogueTitle,
      gender: MOCK_RUBRIC_LEVEL_THREE_A_A.catalogueTitle.gender as GenderEnum,
    },
  });

  const rubricLevelThreeAB = await RubricModel.create({
    ...MOCK_RUBRIC_LEVEL_THREE_A_B,
    views: [],
    priorities: [],
    slug: generateDefaultLangSlug(MOCK_RUBRIC_LEVEL_THREE_A_B.catalogueTitle.defaultTitle),
    variant: rubricVariantAlcohol.id,
    parent: rubricLevelTwoA.id,
    attributesGroups: rubricAttributesGroups(false),
    catalogueTitle: {
      ...MOCK_RUBRIC_LEVEL_THREE_A_B.catalogueTitle,
      gender: MOCK_RUBRIC_LEVEL_THREE_A_B.catalogueTitle.gender as GenderEnum,
    },
  });

  const rubricLevelTwoB = await RubricModel.create({
    ...MOCK_RUBRIC_LEVEL_TWO_B,
    views: [],
    priorities: [],
    slug: generateDefaultLangSlug(MOCK_RUBRIC_LEVEL_TWO_B.catalogueTitle.defaultTitle),
    variant: rubricVariantAlcohol.id,
    parent: rubricLevelOneA.id,
    attributesGroups: [...rubricAttributesGroups(false), ...rubricAttributesGroupsB(true)],
    catalogueTitle: {
      ...MOCK_RUBRIC_LEVEL_TWO_B.catalogueTitle,
      gender: MOCK_RUBRIC_LEVEL_TWO_B.catalogueTitle.gender as GenderEnum,
    },
  });

  const rubricLevelThreeBA = await RubricModel.create({
    ...MOCK_RUBRIC_LEVEL_THREE_B_A,
    views: [],
    priorities: [],
    slug: generateDefaultLangSlug(MOCK_RUBRIC_LEVEL_THREE_B_A.catalogueTitle.defaultTitle),
    variant: rubricVariantAlcohol.id,
    parent: rubricLevelTwoB.id,
    attributesGroups: [...rubricAttributesGroups(false), ...rubricAttributesGroupsB(false)],
    catalogueTitle: {
      ...MOCK_RUBRIC_LEVEL_THREE_B_A.catalogueTitle,
      gender: MOCK_RUBRIC_LEVEL_THREE_B_A.catalogueTitle.gender as GenderEnum,
    },
  });

  const rubricLevelThreeBB = await RubricModel.create({
    ...MOCK_RUBRIC_LEVEL_THREE_B_B,
    views: [],
    priorities: [],
    slug: generateDefaultLangSlug(MOCK_RUBRIC_LEVEL_THREE_B_B.catalogueTitle.defaultTitle),
    variant: rubricVariantAlcohol.id,
    parent: rubricLevelTwoB.id,
    attributesGroups: [...rubricAttributesGroups(false), ...rubricAttributesGroupsB(false)],
    catalogueTitle: {
      ...MOCK_RUBRIC_LEVEL_THREE_B_B.catalogueTitle,
      gender: MOCK_RUBRIC_LEVEL_THREE_B_B.catalogueTitle.gender as GenderEnum,
    },
  });

  return {
    rubricLevelOneA,
    rubricLevelOneB,
    rubricLevelOneC,
    rubricLevelOneD,
    rubricLevelTwoA,
    rubricLevelThreeAA,
    rubricLevelThreeAB,
    rubricLevelTwoB,
    rubricLevelThreeBA,
    rubricLevelThreeBB,
  };
};
