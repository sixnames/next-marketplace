import { COL_EVENT_RUBRICS } from 'db/collectionNames';
import { CreateEventRubricInputInterface } from 'db/dao/eventRubrics/createEventRubric';
import { EventRubricModel, EventRubricPayloadModel, JSONObjectModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import { findDocumentByI18nField } from 'db/utils/findDocumentByI18nField';
import { DEFAULT_COMPANY_SLUG } from 'lib/config/common';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { updateCitiesSeoContent } from 'lib/seoContentUniquenessUtils';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';
import { updateEventRubricSchema } from 'validation/rubricSchema';

export interface UpdateEventRubricInputInterface extends CreateEventRubricInputInterface {
  _id: string;
  textTop?: JSONObjectModel | null;
  textBottom?: JSONObjectModel | null;
  active: boolean;
}

export async function updateEventRubric({
  context,
  input,
}: DaoPropsInterface<UpdateEventRubricInputInterface>): Promise<EventRubricPayloadModel> {
  try {
    const { getApiMessage } = await getRequestParams(context);
    const collections = await getDbCollections();
    const rubricsCollection = collections.eventRubricsCollection();

    // permission
    const { allow, message } = await getOperationPermission({
      context,
      slug: 'updateRubric',
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
        message: await getApiMessage('rubrics.update.error'),
      };
    }

    // validate
    const validationSchema = await getResolverValidationSchema({
      context,
      schema: updateEventRubricSchema,
    });
    await validationSchema.validate(input);

    const { _id, textTop, textBottom, ...values } = input;

    // get rubric
    const rubricId = new ObjectId(_id);
    const rubric = await rubricsCollection.findOne({ _id: rubricId });
    if (!rubric) {
      return {
        success: false,
        message: await getApiMessage('rubrics.update.notFound'),
      };
    }

    // check if exist
    const exist = await findDocumentByI18nField<EventRubricModel>({
      collectionName: COL_EVENT_RUBRICS,
      fieldArg: input.nameI18n,
      fieldName: 'nameI18n',
      additionalQuery: {
        _id: { $ne: rubricId },
      },
    });
    if (exist) {
      return {
        success: false,
        message: await getApiMessage('rubrics.update.duplicate'),
      };
    }

    // update rubric
    const updatedRubricResult = await rubricsCollection.findOneAndUpdate(
      { _id: rubricId },
      {
        $set: values,
      },
      {
        returnDocument: 'after',
      },
    );
    if (!updatedRubricResult.ok) {
      return {
        success: false,
        message: await getApiMessage('rubrics.update.error'),
      };
    }

    // update seo text
    if (textTop) {
      await updateCitiesSeoContent({
        seoContentsList: textTop,
        companySlug: DEFAULT_COMPANY_SLUG,
      });
    }
    if (textBottom) {
      await updateCitiesSeoContent({
        seoContentsList: textBottom,
        companySlug: DEFAULT_COMPANY_SLUG,
      });
    }

    return {
      success: true,
      message: await getApiMessage('rubrics.update.success'),
    };
  } catch (e) {
    console.log('updateEventRubric error', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
