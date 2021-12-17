import { COL_CARTS } from 'db/collectionNames';
import { CartModel, ObjectIdModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';

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
