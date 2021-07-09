import { COL_PAGES, COL_PAGES_GROUP } from 'db/collectionNames';
import { ObjectIdModel, PageModel, PagesGroupModel, PagesGroupPayloadModel } from 'db/dbModels';
import { findDocumentByI18nField } from 'db/findDocumentByI18nField';
import { getDatabase } from 'db/mongodb';
import { CreatePagesGroupInput, UpdatePagesGroupInput } from 'generated/apolloComponents';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from 'lib/sessionHelpers';
import { NexusContext } from 'types/apiContextTypes';
import { createPagesGroupSchema, updatePagesGroupSchema } from 'validation/pagesSchema';

interface CreatePagesGroupInterface {
  input: CreatePagesGroupInput;
  context: NexusContext;
}

export async function createPagesGroup({
  input,
  context,
}: CreatePagesGroupInterface): Promise<PagesGroupPayloadModel> {
  try {
    // Permission
    const { allow, message } = await getOperationPermission({
      context,
      slug: 'createPagesGroup',
    });
    if (!allow) {
      return {
        success: false,
        message,
      };
    }

    // Validate
    const validationSchema = await getResolverValidationSchema({
      context,
      schema: createPagesGroupSchema,
    });
    await validationSchema.validate(input);

    const { getApiMessage } = await getRequestParams(context);
    const { db } = await getDatabase();
    const pagesGroupsCollection = db.collection<PagesGroupModel>(COL_PAGES_GROUP);

    // Check if pages group already exist
    const exist = await findDocumentByI18nField({
      collectionName: COL_PAGES_GROUP,
      fieldName: 'nameI18n',
      fieldArg: input.nameI18n,
      additionalQuery: {
        companySlug: input.companySlug,
      },
      additionalOrQuery: [
        {
          index: input.index,
          companySlug: input.companySlug,
        },
      ],
    });
    if (exist) {
      return {
        success: false,
        message: await getApiMessage('pageGroups.create.duplicate'),
      };
    }

    const createdPagesGroupResult = await pagesGroupsCollection.insertOne({
      ...input,
    });
    const createdPagesGroup = createdPagesGroupResult.ops[0];
    if (!createdPagesGroupResult.result.ok || !createdPagesGroup) {
      return {
        success: false,
        message: await getApiMessage('pageGroups.create.error'),
      };
    }

    return {
      success: true,
      message: await getApiMessage('pageGroups.create.success'),
      payload: createdPagesGroup,
    };
  } catch (e) {
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}

interface UpdatePagesGroupInterface {
  input: UpdatePagesGroupInput;
  context: NexusContext;
}

export async function updatePagesGroup({
  input,
  context,
}: UpdatePagesGroupInterface): Promise<PagesGroupPayloadModel> {
  try {
    // Permission
    const { allow, message } = await getOperationPermission({
      context,
      slug: 'updatePagesGroup',
    });
    if (!allow) {
      return {
        success: false,
        message,
      };
    }

    // Validate
    const validationSchema = await getResolverValidationSchema({
      context,
      schema: updatePagesGroupSchema,
    });
    await validationSchema.validate(input);

    const { getApiMessage } = await getRequestParams(context);
    const { db } = await getDatabase();
    const pagesGroupsCollection = db.collection<PagesGroupModel>(COL_PAGES_GROUP);
    const { _id, ...values } = input;

    // Check pages group availability
    const pagesGroup = await pagesGroupsCollection.findOne({ _id });
    if (!pagesGroup) {
      return {
        success: false,
        message: await getApiMessage('pageGroups.update.notFound'),
      };
    }

    // Check if pages group already exist
    const exist = await findDocumentByI18nField({
      collectionName: COL_PAGES_GROUP,
      fieldName: 'nameI18n',
      fieldArg: input.nameI18n,
      additionalQuery: {
        companySlug: pagesGroup.companySlug,
        _id: {
          $ne: _id,
        },
      },
      additionalOrQuery: [
        {
          _id: {
            $ne: _id,
          },
          index: input.index,
          companySlug: pagesGroup.companySlug,
        },
      ],
    });
    if (exist) {
      return {
        success: false,
        message: await getApiMessage('pageGroups.update.duplicate'),
      };
    }

    const updatedPagesGroupResult = await pagesGroupsCollection.findOneAndUpdate(
      {
        _id,
      },
      {
        $set: {
          ...values,
        },
      },
      {
        returnDocument: 'after',
      },
    );
    const updatedPagesGroup = updatedPagesGroupResult.value;
    if (!updatedPagesGroupResult.ok || !updatedPagesGroup) {
      return {
        success: false,
        message: await getApiMessage('pageGroups.update.error'),
      };
    }

    return {
      success: true,
      message: await getApiMessage('pageGroups.update.success'),
      payload: updatedPagesGroup,
    };
  } catch (e) {
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}

interface DeletePagesGroupInterface {
  _id: ObjectIdModel;
  context: NexusContext;
}

export async function deletePagesGroup({
  _id,
  context,
}: DeletePagesGroupInterface): Promise<PagesGroupPayloadModel> {
  const { getApiMessage } = await getRequestParams(context);
  const { db, client } = await getDatabase();
  const pagesGroupsCollection = db.collection<PagesGroupModel>(COL_PAGES_GROUP);
  const pagesCollection = db.collection<PageModel>(COL_PAGES);

  const session = client.startSession();

  let mutationPayload: PagesGroupPayloadModel = {
    success: false,
    message: await getApiMessage('pageGroups.delete.error'),
  };

  try {
    await session.withTransaction(async () => {
      // Permission
      const { allow, message } = await getOperationPermission({
        context,
        slug: 'deletePagesGroup',
      });
      if (!allow) {
        mutationPayload = {
          success: false,
          message,
        };
        await session.abortTransaction();
        return;
      }

      // Delete pages
      const removedPagesResult = await pagesCollection.deleteMany({
        pagesGroupId: _id,
      });
      if (!removedPagesResult.result.ok) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('pageGroups.delete.error'),
        };
        await session.abortTransaction();
        return;
      }

      // Delete pages group
      const removedPagesGroupResult = await pagesGroupsCollection.findOneAndDelete({
        _id,
      });
      if (!removedPagesGroupResult.ok) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('pageGroups.delete.error'),
        };
        await session.abortTransaction();
        return;
      }

      mutationPayload = {
        success: true,
        message: await getApiMessage('pageGroups.delete.success'),
      };
    });

    return mutationPayload;
  } catch (e) {
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  } finally {
    await session.endSession();
  }
}
