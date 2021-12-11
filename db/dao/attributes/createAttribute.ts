import { COL_ATTRIBUTES, COL_ATTRIBUTES_GROUPS, COL_METRICS } from 'db/collectionNames';
import { findDocumentByI18nField } from 'db/dao/findDocumentByI18nField';
import {
  AttributeModel,
  AttributePayloadModel,
  AttributePositioningInTitleModel,
  AttributesGroupModel,
  AttributeVariantModel,
  AttributeViewVariantModel,
  MetricModel,
  TranslationModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getNextNumberItemId } from 'lib/itemIdUtils';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';
import { addAttributeToGroupSchema } from 'validation/attributesGroupSchema';

export interface CreateAttributeInputInterface {
  attributesGroupId: string;
  nameI18n: TranslationModel;
  optionsGroupId?: string | null;
  metricId?: string | null;
  capitalise?: boolean | null;

  // variants
  variant: AttributeVariantModel;
  viewVariant: AttributeViewVariantModel;

  // positioning in title
  positioningInTitle?: AttributePositioningInTitleModel | null;
  positioningInCardTitle?: AttributePositioningInTitleModel | null;

  // breadcrumbs
  showAsBreadcrumb: boolean;
  showAsCatalogueBreadcrumb?: boolean | null;

  // options modal
  notShowAsAlphabet?: boolean | null;

  // card / snippet visibility
  showInSnippet?: boolean | null;
  showInCard: boolean;
  showInCatalogueFilter: boolean;
  showInCatalogueNav: boolean;
  showInCatalogueTitle: boolean;
  showInCardTitle: boolean;
  showInSnippetTitle: boolean;

  // name visibility
  showNameInTitle?: boolean | null;
  showNameInSelectedAttributes?: boolean | null;
  showNameInCardTitle?: boolean | null;
  showNameInSnippetTitle?: boolean | null;

  // catalogue ui
  showAsLinkInFilter?: boolean | null;
  showAsAccordionInFilter?: boolean | null;
}

export async function createAttribute({
  context,
  input,
}: DaoPropsInterface<CreateAttributeInputInterface>): Promise<AttributePayloadModel> {
  const { getApiMessage } = await getRequestParams(context);
  const { db, client } = await getDatabase();
  const attributesGroupCollection = db.collection<AttributesGroupModel>(COL_ATTRIBUTES_GROUPS);
  const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);
  const metricsCollection = db.collection<MetricModel>(COL_METRICS);

  const session = client.startSession();

  let mutationPayload: AttributePayloadModel = {
    success: false,
    message: await getApiMessage('attributesGroups.addAttribute.success'),
  };

  try {
    await session.withTransaction(async () => {
      // check input
      if (!input) {
        await session.abortTransaction();
        return;
      }

      // permission
      const { allow, message } = await getOperationPermission({
        context,
        slug: 'createAttribute',
      });
      if (!allow) {
        mutationPayload = {
          success: false,
          message,
        };
        await session.abortTransaction();
        return;
      }

      // validate
      const validationSchema = await getResolverValidationSchema({
        context,
        schema: addAttributeToGroupSchema,
      });
      await validationSchema.validate(input);

      const { attributesGroupId, optionsGroupId, metricId, ...values } = input;
      const attributesGroupObjectId = new ObjectId(attributesGroupId);
      const metricObjectId = metricId ? new ObjectId(metricId) : null;
      const optionsGroupObjectId = optionsGroupId ? new ObjectId(optionsGroupId) : null;

      // Check if attributes group exist
      const attributesGroup = await attributesGroupCollection.findOne({
        _id: attributesGroupObjectId,
      });
      if (!attributesGroup) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`attributesGroups.addAttribute.groupError`),
        };
        await session.abortTransaction();
        return;
      }

      // Check if attribute already exist in the group
      const exist = await findDocumentByI18nField({
        fieldArg: values.nameI18n,
        collectionName: COL_ATTRIBUTES,
        fieldName: 'nameI18n',
        additionalQuery: {
          _id: { $in: attributesGroup.attributesIds },
        },
      });
      if (exist) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`attributesGroups.addAttribute.duplicate`),
        };
        await session.abortTransaction();
        return;
      }

      // Get metric
      let metric = null;
      if (metricObjectId) {
        metric = await metricsCollection.findOne({ _id: metricObjectId });
      }

      // Create attribute
      const slug = await getNextNumberItemId(COL_ATTRIBUTES);
      const createdAttributeResult = await attributesCollection.insertOne({
        ...values,
        slug,
        metric,
        attributesGroupId: attributesGroup._id,
        optionsGroupId: optionsGroupObjectId,
        showAsBreadcrumb: false,
        showInCard: true,
      });
      const createdAttribute = await attributesCollection.findOne({
        _id: createdAttributeResult.insertedId,
      });
      if (!createdAttributeResult.acknowledged || !createdAttribute) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`attributesGroups.addAttribute.attributeError`),
        };
        await session.abortTransaction();
        return;
      }

      // Add attribute _id to the attributes group
      const updatedGroupResult = await attributesGroupCollection.findOneAndUpdate(
        { _id: attributesGroup._id },
        {
          $push: {
            attributesIds: createdAttributeResult.insertedId,
          },
        },
        {
          returnDocument: 'after',
        },
      );
      const updatedGroup = updatedGroupResult.value;
      if (!updatedGroupResult.ok || !updatedGroup) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`attributesGroups.addAttribute.groupError`),
        };
        await session.abortTransaction();
        return;
      }

      mutationPayload = {
        success: true,
        message: await getApiMessage('attributesGroups.addAttribute.success'),
        payload: createdAttribute,
      };
    });

    return mutationPayload;
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  } finally {
    await session.endSession();
  }
}
