import { COL_EVENT_RUBRICS } from 'db/collectionNames';
import {
  EventRubricModel,
  EventRubricPayloadModel,
  GenderModel,
  TranslationModel,
} from 'db/dbModels';
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
import { createEventRubricSchema } from 'validation/rubricSchema';

export interface CreateEventRubricInputInterface {
  companySlug: string;
  companyId: string;
  nameI18n: TranslationModel;
  descriptionI18n: TranslationModel;
  shortDescriptionI18n: TranslationModel;
  defaultTitleI18n: TranslationModel;
  prefixI18n?: TranslationModel | null;
  keywordI18n: TranslationModel;
  gender: GenderModel;
  capitalise?: boolean | null;
  showRubricNameInProductTitle?: boolean | null;
}

export async function createEventRubric({
  context,
  input,
}: DaoPropsInterface<CreateEventRubricInputInterface>): Promise<EventRubricPayloadModel> {
  try {
    const { getApiMessage } = await getRequestParams(context);
    const collections = await getDbCollections();
    const rubricsCollection = collections.eventRubricsCollection();

    // permission
    const { allow, message } = await getOperationPermission({
      context,
      slug: 'createEventRubric',
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
      schema: createEventRubricSchema,
    });
    await validationSchema.validate(input);

    // check if exist
    const companyId = new ObjectId(input.companyId);
    const exist = await findDocumentByI18nField<EventRubricModel>({
      collectionName: COL_EVENT_RUBRICS,
      fieldArg: input.nameI18n,
      fieldName: 'nameI18n',
      additionalQuery: {
        companyId,
      },
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
      companyId,
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
    console.log('createEventRubric error', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
