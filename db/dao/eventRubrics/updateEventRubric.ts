import { COL_EVENT_RUBRICS } from 'db/collectionNames';
import { CreateEventRubricInputInterface } from 'db/dao/eventRubrics/createEventRubric';
import { findDocumentByI18nField } from 'db/utils/findDocumentByI18nField';
import { EventRubricModel, EventRubricPayloadModel, JSONObjectModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { updateCitiesSeoContent } from 'lib/seoContentUniquenessUtils';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from 'lib/sessionHelpers';
import { execUpdateProductTitles } from 'lib/updateProductTitles';
import { ObjectId } from 'mongodb';
import { updateRubricSchema } from 'validation/rubricSchema';

export interface UpdateEventRubricInputInterface extends CreateEventRubricInputInterface {
  _id: string;
  textTop?: JSONObjectModel | null;
  textBottom?: JSONObjectModel | null;
  companySlug: string;
  active: boolean;
}

export async function updateEventRubric({
  context,
  input,
}: DaoPropsInterface<UpdateEventRubricInputInterface>): Promise<EventRubricPayloadModel> {
  try {
    const { getApiMessage } = await getRequestParams(context);
    const { db } = await getDatabase();
    const rubricsCollection = db.collection<EventRubricModel>(COL_EVENT_RUBRICS);

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
      schema: updateRubricSchema,
    });
    await validationSchema.validate(input);

    const { _id, textTop, textBottom, companySlug, companyId, ...values } = input;

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
    const companyObjectId = new ObjectId(companyId);
    const exist = await findDocumentByI18nField<EventRubricModel>({
      collectionName: COL_EVENT_RUBRICS,
      fieldArg: input.nameI18n,
      fieldName: 'nameI18n',
      additionalQuery: {
        _id: { $ne: rubricId },
        companyId: companyObjectId,
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
        companySlug,
      });
    }
    if (textBottom) {
      await updateCitiesSeoContent({
        seoContentsList: textBottom,
        companySlug,
      });
    }

    // update product titles
    execUpdateProductTitles(`rubricSlug=${rubric.slug}`);

    return {
      success: true,
      message: await getApiMessage('rubrics.update.success'),
    };
  } catch (e) {
    console.log('updateRubric error', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
