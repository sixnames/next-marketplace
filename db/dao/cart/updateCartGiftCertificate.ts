import { ObjectIdModel } from '../../dbModels';
import { getDbCollections } from '../../mongodb';

export interface UpdateCartGiftCertificateInterface {
  cartId: ObjectIdModel;
  giftCertificateId: ObjectIdModel;
}

export async function updateCartGiftCertificate({
  cartId,
  giftCertificateId,
}: UpdateCartGiftCertificateInterface) {
  const collections = await getDbCollections();
  const cartsCollection = collections.cartsCollection();
  await cartsCollection.findOneAndUpdate(
    {
      _id: cartId,
    },
    {
      $addToSet: {
        giftCertificateIds: giftCertificateId,
      },
    },
  );
}
