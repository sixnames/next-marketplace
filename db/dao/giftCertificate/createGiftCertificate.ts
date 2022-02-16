import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';
import trim from 'trim';
import { GiftCertificatePayloadModel, TranslationModel } from '../../dbModels';
import { getDbCollections } from '../../mongodb';
import { DaoPropsInterface } from '../../uiInterfaces';

export interface CreateGiftCertificateInputInterface {
  code: string;
  companyId: string;
  companySlug: string;
  initialValue: number;
  nameI18n?: TranslationModel;
  descriptionI18n?: TranslationModel;
}

export async function createGiftCertificate({
  input,
  context,
}: DaoPropsInterface<CreateGiftCertificateInputInterface>): Promise<GiftCertificatePayloadModel> {
  try {
    const { getApiMessage } = await getRequestParams(context);
    const collections = await getDbCollections();
    const giftCertificatesCollection = collections.giftCertificatesCollection();

    // check input
    if (!input || !input.code) {
      return {
        success: false,
        message: await getApiMessage('giftCertificate.create.error'),
      };
    }

    // permission
    const { allow, message } = await getOperationPermission({
      context,
      slug: 'createGiftCertificate',
    });
    if (!allow) {
      return {
        success: false,
        message,
      };
    }

    // check if exist
    const exist = await giftCertificatesCollection.findOne({
      companyId: new ObjectId(input.companyId),
      code: trim(input.code),
    });
    if (exist) {
      return {
        success: false,
        message: await getApiMessage('giftCertificate.create.exist'),
      };
    }

    // create
    const createdGiftCertificateResult = await giftCertificatesCollection.insertOne({
      log: [],
      code: trim(input.code),
      nameI18n: input.nameI18n,
      descriptionI18n: input.descriptionI18n,
      initialValue: input.initialValue,
      value: input.initialValue,
      companySlug: input.companySlug,
      companyId: new ObjectId(input.companyId),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    if (!createdGiftCertificateResult.acknowledged) {
      return {
        success: false,
        message: await getApiMessage('giftCertificate.create.error'),
      };
    }

    return {
      success: true,
      message: await getApiMessage('giftCertificate.create.success'),
    };
  } catch (e) {
    console.log('createGiftCertificate error ', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
