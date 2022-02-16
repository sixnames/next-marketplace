import { BlackListProductItemModel, BlackListProductModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { SyncBlackListProductInterface, SyncParamsInterface } from 'db/syncInterfaces';
import { alwaysString } from 'lib/arrayUtils';
import { REQUEST_METHOD_GET, REQUEST_METHOD_POST, SORT_ASC } from 'lib/config/common';
import { noNaN } from 'lib/numbers';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const query = req.query as unknown as SyncParamsInterface | undefined | null;
    if (!query?.token) {
      res.status(400).send({
        success: false,
        message: 'no query params provided',
      });
      return;
    }

    const collections = await getDbCollections();
    const shopsCollection = collections.shopsCollection();
    const blacklistProductsCollection = collections.blackListProductsCollection();

    // get shop
    const shop = await shopsCollection.findOne({ token: query.token });
    if (!shop) {
      res.status(401).send({
        success: false,
        message: 'shop not found',
      });
      return;
    }

    // add new blacklist items
    if (req.method === REQUEST_METHOD_POST) {
      const body = JSON.parse(req.body || []) as SyncBlackListProductInterface[] | undefined | null;
      if (!body || body.length < 1) {
        res.status(400).send({
          success: false,
          message: 'no body provided',
        });
        return;
      }

      const blacklist: BlackListProductModel[] = [];
      for await (const requestItem of body) {
        const { id, products } = requestItem;
        if (!id) {
          continue;
        }

        const shopProductUid = alwaysString(id);

        const filteredProducts = products.reduce((acc: BlackListProductItemModel[], product) => {
          const { barcode, available, price, name, id } = product;
          if (!barcode || barcode.length < 1) {
            return acc;
          }
          const productPayload: BlackListProductItemModel = {
            id,
            barcode,
            available: noNaN(available),
            price: noNaN(price),
            name: `${name}`,
          };
          return [...acc, productPayload];
        }, []);

        // check if exists and update existing
        const existingBlacklistProduct = await blacklistProductsCollection.findOne({
          shopId: shop._id,
          shopProductUid,
        });
        if (existingBlacklistProduct) {
          await blacklistProductsCollection.findOneAndUpdate(
            {
              _id: existingBlacklistProduct._id,
            },
            {
              $set: {
                products: filteredProducts,
              },
            },
          );
          continue;
        }

        const payload: BlackListProductModel = {
          _id: new ObjectId(),
          shopId: shop._id,
          shopProductUid,
          products: filteredProducts,
        };

        blacklist.push(payload);
      }

      await blacklistProductsCollection.insertMany(blacklist);

      res.status(200).send({
        success: true,
        message: 'success',
      });
      return;
    }

    // send blacklist items
    if (req.method === REQUEST_METHOD_GET) {
      const blacklist = await blacklistProductsCollection
        .find(
          {
            shopId: shop._id,
          },
          {
            sort: {
              _id: SORT_ASC,
            },
          },
        )
        .toArray();

      res.status(200).send({
        success: true,
        message: 'success',
        blacklist,
      });
      return;
    }

    res.status(405).send({
      success: false,
      message: 'wrong method',
    });
    return;
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: 'Internal server error',
    });
    return;
  }
};
