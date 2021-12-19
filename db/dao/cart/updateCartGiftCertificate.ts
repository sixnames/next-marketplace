import { COL_CARTS } from '../../collectionNames';
import { CartModel, ObjectIdModel } from '../../dbModels';
import { getDatabase } from '../../mongodb';

export interface UpdateCartGiftCertificateInterface {
  cartId: ObjectIdModel;
  giftCertificateId: ObjectIdModel;
}

export async function updateCartGiftCertificate({
  cartId,
  giftCertificateId,
}: UpdateCartGiftCertificateInterface) {
  const { db } = await getDatabase();
  const cartsCollection = db.collection<CartModel>(COL_CARTS);
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
