import { ShopModel, ShopProductPayloadModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { SUPPLIER_PRICE_VARIANT_ENUMS } from 'lib/config/common';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { arg, enumType, extendType, inputObjectType, nonNull, objectType } from 'nexus';
import getResolverErrorMessage from '../lib/getResolverErrorMessage';

export const ShopProductOldPrice = objectType({
  name: 'ShopProductOldPrice',
  definition(t) {
    t.implements('Timestamp');
    t.nonNull.int('price');
  },
});

export const ShopProduct = objectType({
  name: 'ShopProduct',
  definition(t) {
    t.nonNull.objectId('_id');
    t.implements('Timestamp');
    t.nonNull.string('citySlug');
    t.nonNull.int('available');
    t.nonNull.int('price');
    t.nonNull.objectId('productId');
    t.nonNull.objectId('shopId');
    t.list.nonNull.string('barcode');
    t.nonNull.list.nonNull.field('oldPrices', {
      type: 'ShopProductOldPrice',
    });
    t.int('oldPrice');
    t.field('discountedPercent', {
      type: 'Int',
    });

    // ShopProduct shop field resolver
    t.nonNull.field('shop', {
      type: 'Shop',
      resolve: async (source): Promise<ShopModel> => {
        const collections = await getDbCollections();
        const shopsCollection = collections.shopsCollection();
        const shop = await shopsCollection.findOne({ _id: source.shopId });
        if (!shop) {
          throw Error('Shop not found in ShopProduct');
        }
        return shop;
      },
    });
  },
});

export const ShopProductPayload = objectType({
  name: 'ShopProductPayload',
  definition(t) {
    t.implements('Payload');
    t.field('payload', {
      type: 'ShopProduct',
    });
  },
});

export const SupplierPriceVariant = enumType({
  name: 'SupplierPriceVariant',
  members: SUPPLIER_PRICE_VARIANT_ENUMS,
  description: 'SupplierPriceVariant variant enum.',
});

export const AddShopProductSupplierInput = inputObjectType({
  name: 'AddShopProductSupplierInput',
  definition(t) {
    t.nonNull.objectId('shopProductId');
    t.nonNull.objectId('supplierId');
    t.nonNull.int('price');
    t.nonNull.int('percent');
    t.nonNull.field('variant', {
      type: 'SupplierPriceVariant',
    });
  },
});

export const UpdateShopProductSupplierInput = inputObjectType({
  name: 'UpdateShopProductSupplierInput',
  definition(t) {
    t.nonNull.objectId('supplierProductId');
    t.nonNull.int('price');
    t.nonNull.int('percent');
    t.nonNull.field('variant', {
      type: 'SupplierPriceVariant',
    });
  },
});

export const ShopProductMutations = extendType({
  type: 'Mutation',
  definition(t) {
    // Should add shop products supplier
    t.nonNull.field('addShopProductSupplier', {
      type: 'ShopProductPayload',
      description: 'Should add shop products supplier',
      args: {
        input: nonNull(
          arg({
            type: 'AddShopProductSupplierInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<ShopProductPayloadModel> => {
        const { getApiMessage } = await getRequestParams(context);
        const collections = await getDbCollections();
        const shopProductsCollection = collections.shopProductsCollection();
        const suppliersCollection = collections.suppliersCollection();
        const supplierProductsCollection = collections.supplierProductsCollection();

        const session = collections.client.startSession();

        let mutationPayload: ShopProductPayloadModel = {
          success: false,
          message: await getApiMessage('shopProducts.update.error'),
        };

        try {
          await session.withTransaction(async () => {
            // permission
            const { allow, message } = await getOperationPermission({
              context,
              slug: 'updateShopProduct',
            });
            if (!allow) {
              mutationPayload = {
                success: false,
                message,
              };
              await session.abortTransaction();
              return;
            }

            const { input } = args;

            // get shop product
            const shopProduct = await shopProductsCollection.findOne({
              _id: input.shopProductId,
            });
            if (!shopProduct) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('shopProducts.update.error'),
              };
              await session.abortTransaction();
              return;
            }

            // get supplier
            const supplier = await suppliersCollection.findOne({
              _id: input.supplierId,
            });
            if (!supplier) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('shopProducts.update.error'),
              };
              await session.abortTransaction();
              return;
            }

            // check if supplier product already exist
            const existingSupplierProduct = await supplierProductsCollection.findOne({
              supplierId: input.supplierId,
              shopProductId: input.shopProductId,
            });
            if (existingSupplierProduct) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('shopProducts.update.error'),
              };
              await session.abortTransaction();
              return;
            }

            // create supplier product
            const createdSupplierProductResult = await supplierProductsCollection.insertOne({
              shopProductId: shopProduct._id,
              supplierId: supplier._id,
              percent: input.percent,
              price: input.price,
              variant: input.variant,
              companyId: shopProduct.companyId,
              shopId: shopProduct.shopId,
            });
            if (!createdSupplierProductResult.acknowledged) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('shopProducts.update.error'),
              };
              await session.abortTransaction();
              return;
            }

            mutationPayload = {
              success: true,
              message: await getApiMessage('shopProducts.update.success'),
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
      },
    });

    // Should update shop products supplier
    t.nonNull.field('updateShopProductSupplier', {
      type: 'ShopProductPayload',
      description: 'Should update shop products supplier',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateShopProductSupplierInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<ShopProductPayloadModel> => {
        const { getApiMessage } = await getRequestParams(context);
        const collections = await getDbCollections();
        const supplierProductsCollection = collections.supplierProductsCollection();

        const session = collections.client.startSession();

        let mutationPayload: ShopProductPayloadModel = {
          success: false,
          message: await getApiMessage('shopProducts.update.error'),
        };

        try {
          await session.withTransaction(async () => {
            // permission
            const { allow, message } = await getOperationPermission({
              context,
              slug: 'updateShopProduct',
            });
            if (!allow) {
              mutationPayload = {
                success: false,
                message,
              };
              await session.abortTransaction();
              return;
            }

            const { input } = args;
            const { supplierProductId, ...values } = input;

            // get supplier product
            const supplierProduct = await supplierProductsCollection.findOne({
              _id: supplierProductId,
            });
            if (!supplierProduct) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('shopProducts.update.error'),
              };
              await session.abortTransaction();
              return;
            }

            // create supplier product
            const updatedSupplierProductResult = await supplierProductsCollection.findOneAndUpdate(
              {
                _id: supplierProduct._id,
              },
              {
                $set: {
                  percent: values.percent,
                  price: values.price,
                  variant: values.variant,
                },
              },
            );
            if (!updatedSupplierProductResult.ok) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('shopProducts.update.error'),
              };
              await session.abortTransaction();
              return;
            }

            mutationPayload = {
              success: true,
              message: await getApiMessage('shopProducts.update.success'),
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
      },
    });

    // Should delete shop products supplier
    t.nonNull.field('deleteShopProductSupplier', {
      type: 'ShopProductPayload',
      description: 'Should delete shop products supplier',
      args: {
        _id: nonNull(
          arg({
            type: 'ObjectId',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<ShopProductPayloadModel> => {
        const { getApiMessage } = await getRequestParams(context);
        const collections = await getDbCollections();
        const supplierProductsCollection = collections.supplierProductsCollection();

        const session = collections.client.startSession();

        let mutationPayload: ShopProductPayloadModel = {
          success: false,
          message: await getApiMessage('shopProducts.update.error'),
        };

        try {
          await session.withTransaction(async () => {
            // permission
            const { allow, message } = await getOperationPermission({
              context,
              slug: 'updateShopProduct',
            });
            if (!allow) {
              mutationPayload = {
                success: false,
                message,
              };
              await session.abortTransaction();
              return;
            }

            // create supplier product
            const removedSupplierProductResult = await supplierProductsCollection.findOneAndDelete({
              _id: args._id,
            });
            if (!removedSupplierProductResult.ok) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('shopProducts.update.error'),
              };
              await session.abortTransaction();
              return;
            }

            mutationPayload = {
              success: true,
              message: await getApiMessage('shopProducts.update.success'),
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
      },
    });
  },
});
