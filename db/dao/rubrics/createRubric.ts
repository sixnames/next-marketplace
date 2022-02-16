import { COL_RUBRICS } from 'db/collectionNames';
import { GenderModel, RubricModel, RubricPayloadModel, TranslationModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import { findDocumentByI18nField } from 'db/utils/findDocumentByI18nField';
import { DEFAULT_COUNTERS_OBJECT } from 'lib/config/common';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from 'lib/sessionHelpers';
import { generateDefaultLangSlug } from 'lib/slugUtils';
import { ObjectId } from 'mongodb';
import { createRubricSchema } from 'validation/rubricSchema';

export interface CreateRubricInputInterface {
  nameI18n: TranslationModel;
  descriptionI18n: TranslationModel;
  shortDescriptionI18n: TranslationModel;
  defaultTitleI18n: TranslationModel;
  prefixI18n?: TranslationModel | null;
  keywordI18n: TranslationModel;
  gender: GenderModel;
  capitalise?: boolean | null;
  showRubricNameInProductTitle?: boolean | null;
  showCategoryInProductTitle?: boolean | null;
  showBrandInNav?: boolean | null;
  showBrandInFilter?: boolean | null;
  showBrandAsAlphabet?: boolean | null;
  variantId: string;
}

export async function createRubric({
  context,
  input,
}: DaoPropsInterface<CreateRubricInputInterface>): Promise<RubricPayloadModel> {
  try {
    const { getApiMessage } = await getRequestParams(context);
    const collections = await getDbCollections();
    const rubricsCollection = collections.rubricsCollection();

    // permission
    const { allow, message } = await getOperationPermission({
      context,
      slug: 'createRubric',
    });
    if (!allow) {
      return {
        success: false,
        message,
      };
    }

    // check input
    if (!input) {
      return {
        success: false,
        message: await getApiMessage('none'),
      };
    }

    // validate
    const validationSchema = await getResolverValidationSchema({
      context,
      schema: createRubricSchema,
    });
    await validationSchema.validate(input);

    // check if exist
    const exist = await findDocumentByI18nField<RubricModel>({
      collectionName: COL_RUBRICS,
      fieldArg: input.nameI18n,
      fieldName: 'nameI18n',
    });
    if (exist) {
      return {
        success: false,
        message: await getApiMessage('rubrics.create.duplicate'),
      };
    }

    // create
    const slug = generateDefaultLangSlug(input.nameI18n);
    const createdRubricResult = await rubricsCollection.insertOne({
      ...input,
      slug,
      variantId: new ObjectId(input.variantId),
      active: true,
      attributesGroupIds: [],
      filterVisibleAttributeIds: [],
      cmsCardAttributeIds: [],
      ...DEFAULT_COUNTERS_OBJECT,
    });
    if (!createdRubricResult.acknowledged) {
      return {
        success: false,
        message: await getApiMessage('rubrics.create.error'),
      };
    }

    return {
      success: true,
      message: await getApiMessage('rubrics.create.success'),
    };
  } catch (e) {
    console.log('createRubric error', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
