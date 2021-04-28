import { noNaN } from 'lib/numbers';
import { ObjectId } from 'mongodb';
import { arg, extendType, inputObjectType, nonNull, objectType } from 'nexus';
import {
  AttributeModel,
  OptionModel,
  ProductAssetsModel,
  ProductAttributeModel,
  ProductConnectionItemModel,
  ProductConnectionModel,
  ProductModel,
  ProductPayloadModel,
  RubricModel,
  ShopProductModel,
} from 'db/dbModels';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getRequestParams, getResolverValidationSchema, getSessionRole } from 'lib/sessionHelpers';
import { getDatabase } from 'db/mongodb';
import {
  COL_ATTRIBUTES,
  COL_OPTIONS,
  COL_PRODUCT_ASSETS,
  COL_PRODUCT_ATTRIBUTES,
  COL_PRODUCT_CONNECTION_ITEMS,
  COL_PRODUCT_CONNECTIONS,
  COL_PRODUCTS,
  COL_RUBRICS,
  COL_SHOP_PRODUCTS,
} from 'db/collectionNames';
import { generateProductSlug } from 'lib/slugUtils';
import {
  ASSETS_DIST_PRODUCTS,
  ASSETS_PRODUCT_IMAGE_WIDTH,
  ATTRIBUTE_VARIANT_SELECT,
  CONFIG_DEFAULT_COMPANY_SLUG,
  DEFAULT_LOCALE,
  VIEWS_COUNTER_STEP,
} from 'config/common';
import { getNextItemId } from 'lib/itemIdUtils';
import {
  addProductToConnectionSchema,
  createProductConnectionSchema,
  createProductSchema,
  deleteProductFromConnectionSchema,
  addProductAssetsSchema,
  updateProductSchema,
} from 'validation/productSchema';
import { deleteUpload, getMainImage, reorderAssets, storeUploads } from 'lib/assets';

export const ProductPayload = objectType({
  name: 'ProductPayload',
  definition(t) {
    t.implements('Payload');
    t.field('payload', {
      type: 'Product',
    });
  },
});

export const ProductAttributeInput = inputObjectType({
  name: 'ProductAttributeInput',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.boolean('showInCard');
    t.nonNull.boolean('showAsBreadcrumb');
    t.nonNull.objectId('attributeId');
    t.nonNull.string('attributeSlug');
    t.nonNull.json('attributeNameI18n');
    t.nonNull.field('attributeViewVariant', {
      type: 'AttributeViewVariant',
    });
    t.nonNull.field('attributeVariant', {
      type: 'AttributeVariant',
    });
    t.json('textI18n');
    t.float('number');
    t.nonNull.list.nonNull.field('selectedOptionsSlugs', {
      type: 'String',
      description: 'List of selected options slug',
    });
  },
});

export const CreateProductInput = inputObjectType({
  name: 'CreateProductInput',
  definition(t) {
    t.nonNull.boolean('active');
    t.nonNull.string('originalName');
    t.nonNull.json('nameI18n');
    t.nonNull.json('descriptionI18n');
    t.nonNull.list.nonNull.upload('assets');
    t.nonNull.objectId('rubricId');
    // t.string('brandSlug');
    // t.string('brandCollectionSlug');
    // t.string('manufacturerSlug');
    /*t.nonNull.list.nonNull.field('attributes', {
      type: 'ProductAttributeInput',
    });*/
  },
});

export const UpdateProductInput = inputObjectType({
  name: 'UpdateProductInput',
  definition(t) {
    t.nonNull.objectId('productId');
    t.nonNull.boolean('active');
    t.nonNull.string('originalName');
    t.nonNull.json('nameI18n');
    t.nonNull.json('descriptionI18n');
    // t.nonNull.objectId('rubricId');
    // t.string('brandSlug');
    // t.string('brandCollectionSlug');
    // t.string('manufacturerSlug');
    /*t.nonNull.list.nonNull.field('attributes', {
      type: 'ProductAttributeInput',
    });*/
  },
});

export const UpdateProductAssetsInput = inputObjectType({
  name: 'AddProductAssetsInput',
  definition(t) {
    t.nonNull.objectId('productId');
    t.nonNull.list.nonNull.upload('assets');
  },
});

export const DeleteProductAssetInput = inputObjectType({
  name: 'DeleteProductAssetInput',
  definition(t) {
    t.nonNull.objectId('productId');
    t.nonNull.int('assetIndex');
  },
});

export const UpdateProductAssetIndexInput = inputObjectType({
  name: 'UpdateProductAssetIndexInput',
  definition(t) {
    t.nonNull.objectId('productId');
    t.nonNull.string('assetUrl');
    t.nonNull.int('assetNewIndex');
  },
});

export const CreateProductConnectionInput = inputObjectType({
  name: 'CreateProductConnectionInput',
  definition(t) {
    t.nonNull.objectId('productId');
    t.nonNull.objectId('attributeId');
  },
});

export const AddProductToConnectionInput = inputObjectType({
  name: 'AddProductToConnectionInput',
  definition(t) {
    t.nonNull.objectId('productId');
    t.nonNull.objectId('addProductId');
    t.nonNull.objectId('connectionId');
  },
});

export const DeleteProductFromConnectionInput = inputObjectType({
  name: 'DeleteProductFromConnectionInput',
  definition(t) {
    t.nonNull.objectId('productId');
    t.nonNull.objectId('deleteProductId');
    t.nonNull.objectId('connectionId');
  },
});

export const UpdateProductCounterInput = inputObjectType({
  name: 'UpdateProductCounterInput',
  definition(t) {
    t.nonNull.list.nonNull.objectId('shopProductIds');
    t.string('companySlug', { default: CONFIG_DEFAULT_COMPANY_SLUG });
  },
});

export const UpdateProductBrandInput = inputObjectType({
  name: 'UpdateProductBrandInput',
  definition(t) {
    t.nonNull.objectId('productId');
    t.string('brandSlug');
  },
});

export const UpdateProductBrandCollectionInput = inputObjectType({
  name: 'UpdateProductBrandCollectionInput',
  definition(t) {
    t.nonNull.objectId('productId');
    t.string('brandCollectionSlug');
  },
});

export const UpdateProductManufacturerInput = inputObjectType({
  name: 'UpdateProductManufacturerInput',
  definition(t) {
    t.nonNull.objectId('productId');
    t.string('manufacturerSlug');
  },
});

export const UpdateProductSelectAttributeInput = inputObjectType({
  name: 'UpdateProductSelectAttributeInput',
  definition(t) {
    t.nonNull.objectId('productId');
    t.nonNull.objectId('productAttributeId');
    t.nonNull.objectId('attributeId');
    t.nonNull.list.nonNull.objectId('selectedOptionsIds');
  },
});

export const UpdateProductNumberAttributeItemInput = inputObjectType({
  name: 'UpdateProductNumberAttributeItemInput',
  definition(t) {
    t.nonNull.objectId('productAttributeId');
    t.nonNull.objectId('attributeId');
    t.float('number');
  },
});

export const UpdateProductNumberAttributeInput = inputObjectType({
  name: 'UpdateProductNumberAttributeInput',
  definition(t) {
    t.nonNull.objectId('productId');
    t.nonNull.list.nonNull.field('attributes', {
      type: 'UpdateProductNumberAttributeItemInput',
    });
  },
});

export const UpdateProductTextAttributeItemInput = inputObjectType({
  name: 'UpdateProductTextAttributeItemInput',
  definition(t) {
    t.nonNull.objectId('productAttributeId');
    t.nonNull.objectId('attributeId');
    t.json('textI18n');
  },
});

export const UpdateProductTextAttributeInput = inputObjectType({
  name: 'UpdateProductTextAttributeInput',
  definition(t) {
    t.nonNull.objectId('productId');
    t.nonNull.list.nonNull.field('attributes', {
      type: 'UpdateProductTextAttributeItemInput',
    });
  },
});

// Product Mutations
export const ProductMutations = extendType({
  type: 'Mutation',
  definition(t) {
    // Should create product
    t.nonNull.field('createProduct', {
      type: 'ProductPayload',
      description: 'Should create product',
      args: {
        input: nonNull(
          arg({
            type: 'CreateProductInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<ProductPayloadModel> => {
        try {
          // Validate
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: createProductSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
          const productAssetsCollection = db.collection<ProductAssetsModel>(COL_PRODUCT_ASSETS);
          const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
          const { input } = args;
          const { rubricId, assets, ...values } = input;

          // Get selected rubric
          const rubric = await rubricsCollection.findOne({ _id: rubricId });
          if (!rubric) {
            return {
              success: false,
              message: await getApiMessage(`products.update.error`),
            };
          }

          // Store product assets
          const itemId = await getNextItemId(COL_PRODUCTS);
          const productAssets = await storeUploads({
            itemId,
            dist: ASSETS_DIST_PRODUCTS,
            files: assets,
            asImage: true,
            width: ASSETS_PRODUCT_IMAGE_WIDTH,
          });
          if (!productAssets) {
            return {
              success: false,
              message: await getApiMessage(`products.create.error`),
            };
          }

          const slug = generateProductSlug({ nameI18n: values.nameI18n, itemId });

          const productId = new ObjectId();
          const mainImage = getMainImage(productAssets);
          const createdProductResult = await productsCollection.insertOne({
            ...values,
            _id: productId,
            itemId,
            mainImage,
            slug,
            rubricId,
            rubricSlug: rubric.slug,
            active: false,
            selectedOptionsSlugs: [],
            selectedAttributesIds: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          const createdProduct = createdProductResult.ops[0];
          if (!createdProductResult.result.ok || !createdProduct) {
            return {
              success: false,
              message: await getApiMessage(`products.create.error`),
            };
          }

          // Create product assets
          const createdAssetsResult = await productAssetsCollection.insertOne({
            productId,
            productSlug: slug,
            assets: productAssets,
          });
          const createdAssets = createdAssetsResult.ops[0];
          if (!createdAssetsResult.result.ok || !createdAssets) {
            return {
              success: false,
              message: await getApiMessage(`products.create.error`),
            };
          }

          return {
            success: true,
            message: await getApiMessage('products.create.success'),
            payload: createdProduct,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should update product
    t.nonNull.field('updateProduct', {
      type: 'ProductPayload',
      description: 'Should update product',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateProductInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<ProductPayloadModel> => {
        try {
          // Validate
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: updateProductSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
          const productAssetsCollection = db.collection<ProductAssetsModel>(COL_PRODUCT_ASSETS);
          const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
          const { input } = args;
          const { productId, ...values } = input;

          // Check product availability
          const product = await productsCollection.findOne({ _id: productId });
          if (!product) {
            return {
              success: false,
              message: await getApiMessage(`products.update.notFound`),
            };
          }

          // Create new slug for product
          const updatedSlug = generateProductSlug({
            nameI18n: values.nameI18n,
            itemId: product.itemId,
          });

          // Update product
          const updatedProductResult = await productsCollection.findOneAndUpdate(
            {
              _id: productId,
            },
            {
              $set: {
                ...values,
                slug: updatedSlug,
                updatedAt: new Date(),
              },
            },
            {
              returnOriginal: false,
            },
          );

          const updatedShopProductResult = await shopProductsCollection.findOneAndUpdate(
            {
              productId,
            },
            {
              $set: {
                slug: updatedSlug,
                nameI18n: values.nameI18n,
                originalName: values.originalName,
                updatedAt: new Date(),
              },
            },
            {
              returnOriginal: false,
            },
          );

          const updatedProductAssetResult = await productAssetsCollection.findOneAndUpdate(
            {
              productId,
            },
            {
              $set: {
                slug: updatedSlug,
              },
            },
          );

          const updatedProduct = updatedProductResult.value;
          if (
            !updatedProductResult.ok ||
            !updatedProduct ||
            !updatedShopProductResult.ok ||
            !updatedProductAssetResult.ok
          ) {
            return {
              success: false,
              message: await getApiMessage(`products.update.error`),
            };
          }

          return {
            success: true,
            message: await getApiMessage('products.update.success'),
            payload: updatedProduct,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should add product assets
    t.nonNull.field('addProductAssets', {
      type: 'ProductPayload',
      description: 'Should add product assets',
      args: {
        input: nonNull(
          arg({
            type: 'AddProductAssetsInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<ProductPayloadModel> => {
        try {
          // Validate
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: addProductAssetsSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
          const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
          const productAssetsCollection = db.collection<ProductAssetsModel>(COL_PRODUCT_ASSETS);
          const { input } = args;
          const { productId } = input;

          // Check product availability
          const product = await productsCollection.findOne({ _id: productId });
          const initialAssets = await productAssetsCollection.findOne({ productId });
          if (!product || !initialAssets) {
            return {
              success: false,
              message: await getApiMessage(`products.update.notFound`),
            };
          }

          // Update product assets
          const sortedAssets = initialAssets.assets.sort((assetA, assetB) => {
            return assetB.index - assetA.index;
          });
          const firstAsset = sortedAssets[0];
          const startIndex = noNaN(firstAsset?.index);
          const assets = await storeUploads({
            itemId: product.itemId,
            dist: ASSETS_DIST_PRODUCTS,
            files: input.assets,
            startIndex,
            asImage: true,
            width: ASSETS_PRODUCT_IMAGE_WIDTH,
          });

          if (!assets) {
            return {
              success: false,
              message: await getApiMessage(`products.update.error`),
            };
          }

          const finalAssets = [...initialAssets.assets, ...assets];
          const mainImage = getMainImage(finalAssets);

          // Update product
          const updatedProductAssetsResult = await productAssetsCollection.findOneAndUpdate(
            {
              productId,
            },
            {
              $set: {
                assets: finalAssets,
              },
            },
            {
              returnOriginal: false,
            },
          );

          const updatedProductAssets = updatedProductAssetsResult.value;
          if (!updatedProductAssetsResult.ok || !updatedProductAssets) {
            return {
              success: false,
              message: await getApiMessage(`products.update.error`),
            };
          }
          const updatedProductMainImageResult = await productsCollection.findOneAndUpdate(
            {
              _id: productId,
            },
            {
              $set: {
                mainImage,
                updatedAt: new Date(),
              },
            },
            {
              returnOriginal: false,
            },
          );

          const updatedProductMainImage = updatedProductMainImageResult.value;
          if (!updatedProductMainImageResult.ok || !updatedProductMainImage) {
            return {
              success: false,
              message: await getApiMessage(`products.update.error`),
            };
          }
          const updatedShopProductsResult = await shopProductsCollection.updateMany(
            {
              productId,
            },
            {
              $set: {
                mainImage,
                updatedAt: new Date(),
              },
            },
          );
          if (!updatedShopProductsResult.result.ok) {
            return {
              success: false,
              message: await getApiMessage(`products.update.error`),
            };
          }

          return {
            success: true,
            message: await getApiMessage('products.update.success'),
            payload: updatedProductMainImage,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should delete product asset
    t.nonNull.field('deleteProductAsset', {
      type: 'ProductPayload',
      description: 'Should update product assets',
      args: {
        input: nonNull(
          arg({
            type: 'DeleteProductAssetInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<ProductPayloadModel> => {
        try {
          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
          const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
          const productAssetsCollection = db.collection<ProductAssetsModel>(COL_PRODUCT_ASSETS);
          const { input } = args;
          const { productId, assetIndex } = input;

          // Check product availability
          const product = await productsCollection.findOne({ _id: productId });
          const initialAssets = await productAssetsCollection.findOne({ productId });
          if (!product || !initialAssets) {
            return {
              success: false,
              message: await getApiMessage(`products.update.notFound`),
            };
          }

          // Delete product asset
          const currentAsset = initialAssets.assets.find(({ index }) => index === assetIndex);
          const removedAsset = await deleteUpload({ filePath: `${currentAsset?.url}` });
          if (!removedAsset) {
            return {
              success: false,
              message: await getApiMessage(`products.update.error`),
            };
          }

          // Update product assets
          const updatedProductAssetsResult = await productAssetsCollection.findOneAndUpdate(
            {
              productId,
            },
            {
              $pull: {
                assets: {
                  index: assetIndex,
                },
              },
            },
            {
              returnOriginal: false,
            },
          );
          const updatedProductAssets = updatedProductAssetsResult.value;
          if (!updatedProductAssetsResult.ok || !updatedProductAssets) {
            return {
              success: false,
              message: await getApiMessage(`products.update.error`),
            };
          }

          const newAssets = updatedProductAssets.assets;
          const mainImage = getMainImage(newAssets);

          // Update product
          const updatedProductResult = await productsCollection.findOneAndUpdate(
            {
              _id: productId,
            },
            {
              $set: {
                mainImage,
                updatedAt: new Date(),
              },
            },
            {
              returnOriginal: false,
            },
          );
          const updatedProduct = updatedProductResult.value;
          if (!updatedProductResult.ok || !updatedProduct) {
            return {
              success: false,
              message: await getApiMessage(`products.update.error`),
            };
          }

          const updatedShopProductsResult = await shopProductsCollection.updateMany(
            {
              productId,
            },
            {
              $set: {
                mainImage,
                updatedAt: new Date(),
              },
            },
          );
          if (!updatedShopProductsResult.result.ok) {
            return {
              success: false,
              message: await getApiMessage(`products.update.error`),
            };
          }

          return {
            success: true,
            message: await getApiMessage('products.update.success'),
            payload: updatedProduct,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should update product asset index
    t.nonNull.field('updateProductAssetIndex', {
      type: 'ProductPayload',
      description: 'Should update product asset index',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateProductAssetIndexInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<ProductPayloadModel> => {
        try {
          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
          const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
          const productAssetsCollection = db.collection<ProductAssetsModel>(COL_PRODUCT_ASSETS);
          const { input } = args;
          const { productId, assetNewIndex, assetUrl } = input;

          // Check product availability
          const product = await productsCollection.findOne({ _id: productId });
          const initialAssets = await productAssetsCollection.findOne({ productId });
          if (!product || !initialAssets) {
            return {
              success: false,
              message: await getApiMessage(`products.update.notFound`),
            };
          }

          // Reorder assets
          const reorderedAssetsWithUpdatedIndexes = reorderAssets({
            assetUrl,
            assetNewIndex,
            initialAssets: initialAssets.assets,
          });
          if (!reorderedAssetsWithUpdatedIndexes) {
            return {
              success: false,
              message: await getApiMessage(`products.update.error`),
            };
          }

          const updatedProductAssetsResult = await productAssetsCollection.findOneAndUpdate(
            {
              productId,
            },
            {
              $set: {
                assets: reorderedAssetsWithUpdatedIndexes,
              },
            },
            {
              returnOriginal: false,
            },
          );
          const updatedProductAssets = updatedProductAssetsResult.value;
          if (!updatedProductAssetsResult.ok || !updatedProductAssets) {
            return {
              success: false,
              message: await getApiMessage(`products.update.error`),
            };
          }
          const newAssets = updatedProductAssets.assets;
          const mainImage = getMainImage(newAssets);

          // Update product
          const updatedProductResult = await productsCollection.findOneAndUpdate(
            {
              _id: productId,
            },
            {
              $set: {
                mainImage,
                updatedAt: new Date(),
              },
            },
            {
              returnOriginal: false,
            },
          );

          const updatedProduct = updatedProductResult.value;
          if (!updatedProductResult.ok || !updatedProduct) {
            return {
              success: false,
              message: await getApiMessage(`products.update.error`),
            };
          }

          const updatedShopProductsResult = await shopProductsCollection.updateMany(
            {
              productId,
            },
            {
              $set: {
                mainImage,
                updatedAt: new Date(),
              },
            },
          );
          if (!updatedShopProductsResult.result.ok) {
            return {
              success: false,
              message: await getApiMessage(`products.update.error`),
            };
          }

          return {
            success: true,
            message: await getApiMessage('products.update.success'),
            payload: updatedProduct,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should create product connection
    t.nonNull.field('createProductConnection', {
      type: 'ProductPayload',
      description: 'Should create product connection',
      args: {
        input: nonNull(
          arg({
            type: 'CreateProductConnectionInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<ProductPayloadModel> => {
        try {
          // Validate
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: createProductConnectionSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
          const productsAttributesCollection = db.collection<ProductAttributeModel>(
            COL_PRODUCT_ATTRIBUTES,
          );
          const productConnectionsCollection = db.collection<ProductConnectionModel>(
            COL_PRODUCT_CONNECTIONS,
          );
          const productConnectionItemsCollection = db.collection<ProductConnectionItemModel>(
            COL_PRODUCT_CONNECTION_ITEMS,
          );
          const optionsCollection = db.collection<OptionModel>(COL_OPTIONS);
          const { input } = args;
          const { productId, attributeId } = input;

          // Check all entities availability
          const product = await productsCollection.findOne({ _id: productId });
          const productConnections = await productConnectionsCollection
            .aggregate([
              {
                $match: { productIds: productId },
              },
            ])
            .toArray();
          const productAttribute = await productsAttributesCollection.findOne({
            productId,
            attributeId,
          });

          // Find current attribute in product
          if (!product || !productAttribute) {
            return {
              success: false,
              message: await getApiMessage(`products.update.notFound`),
            };
          }

          // Check attribute variant. Must be as Select
          if (productAttribute.variant !== ATTRIBUTE_VARIANT_SELECT) {
            return {
              success: false,
              message: await getApiMessage(`products.update.attributeVariantError`),
            };
          }

          // Check if connection already exist
          const exist = productConnections.some((connection) => {
            return connection.attributeId.equals(attributeId);
          });
          if (exist) {
            return {
              success: false,
              message: await getApiMessage(`products.connection.exist`),
            };
          }

          // Find current option
          const optionId = productAttribute.selectedOptionsIds[0];
          if (!optionId) {
            return {
              success: false,
              message: await getApiMessage(`products.connection.createError`),
            };
          }
          const option = await optionsCollection.findOne({ _id: optionId });
          if (!option) {
            return {
              success: false,
              message: await getApiMessage(`products.connection.createError`),
            };
          }

          // Create connection
          const createdConnectionResult = await productConnectionsCollection.insertOne({
            attributeId: productAttribute.attributeId,
            attributeSlug: productAttribute.slug,
            productsIds: [productId],
          });
          const createdConnection = createdConnectionResult.ops[0];
          if (!createdConnectionResult.result.ok || !createdConnection) {
            return {
              success: false,
              message: await getApiMessage(`products.connection.createError`),
            };
          }

          // Create connection item
          const createdConnectionItemResult = await productConnectionItemsCollection.insertOne({
            _id: productId,
            optionId,
            productId,
            productSlug: product.slug,
            connectionId: createdConnection._id,
          });
          const createdConnectionItem = createdConnectionItemResult.ops[0];
          if (!createdConnectionItemResult.result.ok || !createdConnectionItem) {
            return {
              success: false,
              message: await getApiMessage(`products.connection.createError`),
            };
          }

          // Update product
          const updatedProductResult = await productsCollection.findOneAndUpdate(
            {
              _id: productId,
            },
            {
              $set: {
                updatedAt: new Date(),
              },
            },
            {
              returnOriginal: false,
            },
          );
          const updatedProduct = updatedProductResult.value;
          if (!updatedProductResult.ok || !updatedProduct) {
            return {
              success: false,
              message: await getApiMessage(`products.update.error`),
            };
          }

          return {
            success: true,
            message: await getApiMessage('products.connection.createSuccess'),
            payload: updatedProduct,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should add product to connection
    t.nonNull.field('addProductToConnection', {
      type: 'ProductPayload',
      description: 'Should create product connection',
      args: {
        input: nonNull(
          arg({
            type: 'AddProductToConnectionInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<ProductPayloadModel> => {
        try {
          // Validate
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: addProductToConnectionSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
          const productsAttributesCollection = db.collection<ProductAttributeModel>(
            COL_PRODUCT_ATTRIBUTES,
          );
          const productConnectionsCollection = db.collection<ProductConnectionModel>(
            COL_PRODUCT_CONNECTIONS,
          );
          const productConnectionItemsCollection = db.collection<ProductConnectionItemModel>(
            COL_PRODUCT_CONNECTION_ITEMS,
          );
          const optionsCollection = db.collection<OptionModel>(COL_OPTIONS);
          const { input } = args;
          const { productId, addProductId, connectionId } = input;

          // Check all entities availability
          const product = await productsCollection.findOne({ _id: productId });
          const addProduct = await productsCollection.findOne({ _id: addProductId });
          const connection = await productConnectionsCollection.findOne({ _id: connectionId });
          if (!product || !addProduct || !connection) {
            return {
              success: false,
              message: await getApiMessage(`products.update.notFound`),
            };
          }

          // Get all connection items
          const connectionItems = await productConnectionItemsCollection
            .find({ connectionId: connection._id })
            .toArray();

          // Check attribute existence in added product
          const addProductAttribute = await productsAttributesCollection.findOne({
            productId: addProductId,
            attributeId: connection?.attributeId,
          });
          const addProductOptionId = addProductAttribute?.selectedOptionsIds[0];
          if (!addProductAttribute || !addProductOptionId) {
            return {
              success: false,
              message: await getApiMessage('products.connection.noAttributeError'),
            };
          }

          // Check attribute value in added product
          // it should have attribute value and shouldn't intersect with existing values in connection
          const connectionValues = connectionItems.reduce((acc: ObjectId[], { optionId }) => {
            return [...acc, optionId];
          }, []);
          const includes = connectionValues.some((_id) => {
            return _id.equals(addProductOptionId);
          });
          if (includes) {
            return {
              success: false,
              message: await getApiMessage('products.connection.intersect'),
            };
          }

          // Find current option
          const option = await optionsCollection.findOne({ _id: addProductOptionId });
          if (!option) {
            return {
              success: false,
              message: await getApiMessage(`products.connection.createError`),
            };
          }
          if (!option) {
            return {
              success: false,
              message: await getApiMessage(`products.connection.createError`),
            };
          }

          // Create connection item
          const CreatedConnectionItemResult = await productConnectionItemsCollection.insertOne({
            _id: addProductId,
            optionId: option._id,
            productId: addProductId,
            productSlug: addProduct.slug,
            connectionId,
          });

          const CreatedConnectionItem = CreatedConnectionItemResult.ops[0];
          if (!CreatedConnectionItemResult.result.ok || !CreatedConnectionItem) {
            return {
              success: false,
              message: await getApiMessage(`products.connection.createError`),
            };
          }

          // Update product
          const updatedAddProductResult = await productsCollection.findOneAndUpdate(
            {
              _id: addProductId,
            },
            {
              $set: {
                updatedAt: new Date(),
              },
            },
            {
              returnOriginal: false,
            },
          );
          const updatedAddProduct = updatedAddProductResult.value;
          if (!updatedAddProductResult.ok || !updatedAddProduct) {
            return {
              success: false,
              message: await getApiMessage(`products.update.error`),
            };
          }

          // Update product with new slug
          const updatedProductResult = await productsCollection.findOneAndUpdate(
            {
              _id: productId,
            },
            {
              $set: {
                updatedAt: new Date(),
              },
            },
            {
              returnOriginal: false,
            },
          );
          const updatedProduct = updatedProductResult.value;
          if (!updatedProductResult.ok || !updatedProduct) {
            return {
              success: false,
              message: await getApiMessage(`products.update.error`),
            };
          }

          return {
            success: true,
            message: await getApiMessage('products.connection.addProductSuccess'),
            payload: updatedProduct,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should delete product from connection and delete connection
    // if there is no products left
    t.nonNull.field('deleteProductFromConnection', {
      type: 'ProductPayload',
      description:
        'Should delete product from connection and delete connection if there is no products left',
      args: {
        input: nonNull(
          arg({
            type: 'DeleteProductFromConnectionInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<ProductPayloadModel> => {
        try {
          // Validate
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: deleteProductFromConnectionSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
          const productConnectionsCollection = db.collection<ProductConnectionModel>(
            COL_PRODUCT_CONNECTIONS,
          );
          const productConnectionItemsCollection = db.collection<ProductConnectionItemModel>(
            COL_PRODUCT_CONNECTION_ITEMS,
          );
          const { input } = args;
          const { productId, deleteProductId, connectionId } = input;
          const minimumProductsCountForConnectionDelete = 2;

          // Check all entities availability
          const product = await productsCollection.findOne({ _id: productId });
          const deleteProduct = await productsCollection.findOne({ _id: deleteProductId });
          const connection = await productConnectionsCollection.findOne({ _id: connectionId });
          if (!product || !deleteProduct || !connection) {
            return {
              success: false,
              message: await getApiMessage(`products.update.notFound`),
            };
          }

          // Get connection items
          const connectionItems = await productConnectionItemsCollection
            .find({ connectionId })
            .toArray();

          const errorMessage = await getApiMessage('products.connection.deleteError');
          const successMessage = await getApiMessage('products.connection.deleteProductSuccess');

          // Delete connection if it has one item
          if (connectionItems.length < minimumProductsCountForConnectionDelete) {
            const removedConnectionResult = await productConnectionsCollection.findOneAndDelete({
              _id: connectionId,
            });
            if (!removedConnectionResult.ok) {
              return {
                success: false,
                message: errorMessage,
              };
            }
          }

          // Remove connection item
          const removedConnectionItemResult = await productConnectionItemsCollection.findOneAndDelete(
            {
              productId: deleteProductId,
            },
          );
          if (!removedConnectionItemResult.ok) {
            return {
              success: false,
              message: errorMessage,
            };
          }
          const removedConnectionItem = removedConnectionItemResult.value;
          if (!removedConnectionItemResult.ok || !removedConnectionItem) {
            return {
              success: false,
              message: errorMessage,
            };
          }

          return {
            success: true,
            message: successMessage,
            payload: product,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should update product brand
    t.nonNull.field('updateProductBrand', {
      type: 'ProductPayload',
      description: 'Should update product brand',
      args: {
        input: nonNull(arg({ type: 'UpdateProductBrandInput' })),
      },
      resolve: async (_root, args, context): Promise<ProductPayloadModel> => {
        try {
          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
          const { input } = args;
          const { productId, brandSlug } = input;

          // Check product availability
          const product = await productsCollection.findOne({ _id: productId });
          if (!product) {
            return {
              success: false,
              message: await getApiMessage('products.update.error'),
            };
          }

          const updatedProductResult = await productsCollection.findOneAndUpdate(
            {
              _id: productId,
            },
            {
              $set: {
                brandSlug,
                brandCollectionSlug: brandSlug ? product.brandCollectionSlug : null,
              },
            },
            {
              returnOriginal: false,
            },
          );
          const updatedProduct = updatedProductResult.value;
          if (!updatedProductResult.ok || !updatedProduct) {
            return {
              success: false,
              message: await getApiMessage('products.update.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('products.update.success'),
            payload: updatedProduct,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should update product brand collection
    t.nonNull.field('updateProductBrandCollection', {
      type: 'ProductPayload',
      description: 'Should update product brand collection',
      args: {
        input: nonNull(arg({ type: 'UpdateProductBrandCollectionInput' })),
      },
      resolve: async (_root, args, context): Promise<ProductPayloadModel> => {
        try {
          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
          const { input } = args;
          const { productId, brandCollectionSlug } = input;

          // Check product availability
          const product = await productsCollection.findOne({ _id: productId });
          if (!product) {
            return {
              success: false,
              message: await getApiMessage('products.update.error'),
            };
          }

          const updatedProductResult = await productsCollection.findOneAndUpdate(
            {
              _id: productId,
            },
            {
              $set: {
                brandCollectionSlug,
              },
            },
            {
              returnOriginal: false,
            },
          );
          const updatedProduct = updatedProductResult.value;
          if (!updatedProductResult.ok || !updatedProduct) {
            return {
              success: false,
              message: await getApiMessage('products.update.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('products.update.success'),
            payload: updatedProduct,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should update product manufacturer
    t.nonNull.field('updateProductManufacturer', {
      type: 'ProductPayload',
      description: 'Should update product manufacturer',
      args: {
        input: nonNull(arg({ type: 'UpdateProductManufacturerInput' })),
      },
      resolve: async (_root, args, context): Promise<ProductPayloadModel> => {
        try {
          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
          const { input } = args;
          const { productId, manufacturerSlug } = input;

          // Check product availability
          const product = await productsCollection.findOne({ _id: productId });
          if (!product) {
            return {
              success: false,
              message: await getApiMessage('products.update.error'),
            };
          }

          const updatedProductResult = await productsCollection.findOneAndUpdate(
            {
              _id: productId,
            },
            {
              $set: {
                manufacturerSlug,
              },
            },
            {
              returnOriginal: false,
            },
          );
          const updatedProduct = updatedProductResult.value;
          if (!updatedProductResult.ok || !updatedProduct) {
            return {
              success: false,
              message: await getApiMessage('products.update.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('products.update.success'),
            payload: updatedProduct,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should update product select attribute
    t.nonNull.field('updateProductSelectAttribute', {
      type: 'ProductPayload',
      description: 'Should update product select attribute',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateProductSelectAttributeInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<ProductPayloadModel> => {
        try {
          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
          const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);
          const productAttributesCollection = db.collection<ProductAttributeModel>(
            COL_PRODUCT_ATTRIBUTES,
          );
          const optionsCollection = db.collection<OptionModel>(COL_OPTIONS);
          const { input } = args;
          const { selectedOptionsIds, productId, attributeId, productAttributeId } = input;

          // Check if product exist
          const product = await productsCollection.findOne({ _id: productId });
          if (!product) {
            return {
              success: false,
              message: await getApiMessage('products.update.error'),
            };
          }

          // Check if product attribute exist
          let productAttribute = await productAttributesCollection.findOne({
            _id: productAttributeId,
          });

          // Create new product attribute if original is absent
          if (!productAttribute) {
            const attribute = await attributesCollection.findOne({ _id: attributeId });

            if (!attribute) {
              return {
                success: false,
                message: await getApiMessage('products.update.error'),
              };
            }

            productAttribute = {
              ...attribute,
              attributeId,
              productId: product._id,
              productSlug: product.slug,
              selectedOptionsIds: [],
              selectedOptionsSlugs: [],
              number: undefined,
              textI18n: {},
              showAsBreadcrumb: false,
              showInCard: true,
            };
          }

          // Get selected options tree
          const finalOptions: OptionModel[] = [];
          if (selectedOptionsIds.length > 0) {
            const optionsAggregation = await optionsCollection
              .aggregate([
                {
                  $match: {
                    _id: {
                      $in: selectedOptionsIds,
                    },
                  },
                },
                {
                  $graphLookup: {
                    from: COL_OPTIONS,
                    as: 'options',
                    startWith: '$parentId',
                    connectFromField: 'parentId',
                    connectToField: '_id',
                    depthField: 'level',
                  },
                },
              ])
              .toArray();

            // sort parent options in descendant order for each selected option
            optionsAggregation.forEach((selectedOptionTree) => {
              const { options, ...restOption } = selectedOptionTree;

              const sortedOptions = (options || []).sort((a, b) => {
                return noNaN(b.level) - noNaN(a.level);
              });

              const treeQueue = [...sortedOptions, restOption];
              treeQueue.forEach((finalOption) => {
                finalOptions.push(finalOption);
              });
            });
          }

          // Update or create product attribute
          const finalSelectedOptionsSlugs = finalOptions.map(({ slug }) => slug);
          const finalSelectedOptionsIds = finalOptions.map(({ _id }) => _id);
          const { _id, ...restProductAttribute } = productAttribute;
          const updatedProductAttributeResult = await productAttributesCollection.findOneAndUpdate(
            {
              _id,
            },
            {
              $set: {
                ...restProductAttribute,
                selectedOptionsSlugs: finalSelectedOptionsSlugs,
                selectedOptionsIds: finalSelectedOptionsIds,
              },
            },
            {
              upsert: true,
              returnOriginal: false,
            },
          );
          const updatedProductAttribute = updatedProductAttributeResult.value;
          if (!updatedProductAttributeResult.ok || !updatedProductAttribute) {
            return {
              success: false,
              message: await getApiMessage('products.update.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('products.update.success'),
            payload: product,
          };
        } catch (e) {
          console.log(e);
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should update product number attribute
    t.nonNull.field('updateProductNumberAttribute', {
      type: 'ProductPayload',
      description: 'Should update product number attribute',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateProductNumberAttributeInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<ProductPayloadModel> => {
        try {
          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
          const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);
          const productAttributesCollection = db.collection<ProductAttributeModel>(
            COL_PRODUCT_ATTRIBUTES,
          );
          const { input } = args;
          const { productId, attributes } = input;

          // Check if product exist
          const product = await productsCollection.findOne({ _id: productId });
          if (!product) {
            return {
              success: false,
              message: await getApiMessage('products.update.error'),
            };
          }

          for await (const attributesItem of attributes) {
            const { number, attributeId, productAttributeId } = attributesItem;

            // Delete product attribute if value is empty
            if (!number && number !== 0) {
              await productAttributesCollection.findOneAndDelete({ _id: productAttributeId });
              continue;
            }

            // Check if product attribute exist
            let productAttribute = await productAttributesCollection.findOne({
              _id: productAttributeId,
            });

            // Create new product attribute if original is absent
            if (!productAttribute) {
              const attribute = await attributesCollection.findOne({ _id: attributeId });

              if (!attribute) {
                return {
                  success: false,
                  message: await getApiMessage('products.update.error'),
                };
              }

              productAttribute = {
                ...attribute,
                attributeId,
                productId: product._id,
                productSlug: product.slug,
                selectedOptionsIds: [],
                selectedOptionsSlugs: [],
                number: undefined,
                textI18n: {},
                showAsBreadcrumb: false,
                showInCard: true,
              };
            }

            // Update or create product attribute
            const { _id, ...restProductAttribute } = productAttribute;
            await productAttributesCollection.findOneAndUpdate(
              {
                _id,
              },
              {
                $set: {
                  ...restProductAttribute,
                  number,
                },
              },
              {
                upsert: true,
                returnOriginal: false,
              },
            );
          }

          return {
            success: true,
            message: await getApiMessage('products.update.success'),
            payload: product,
          };
        } catch (e) {
          console.log(e);
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should update product text attribute
    t.nonNull.field('updateProductTextAttribute', {
      type: 'ProductPayload',
      description: 'Should update product text attribute',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateProductTextAttributeInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<ProductPayloadModel> => {
        try {
          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
          const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);
          const productAttributesCollection = db.collection<ProductAttributeModel>(
            COL_PRODUCT_ATTRIBUTES,
          );
          const { input } = args;
          const { productId, attributes } = input;

          // Check if product exist
          const product = await productsCollection.findOne({ _id: productId });
          if (!product) {
            return {
              success: false,
              message: await getApiMessage('products.update.error'),
            };
          }

          for await (const attributesItem of attributes) {
            const { textI18n, attributeId, productAttributeId } = attributesItem;

            // Delete product attribute if value is empty
            if (!textI18n || !textI18n[DEFAULT_LOCALE]) {
              await productAttributesCollection.findOneAndDelete({ _id: productAttributeId });
              continue;
            }

            // Check if product attribute exist
            let productAttribute = await productAttributesCollection.findOne({
              _id: productAttributeId,
            });

            // Create new product attribute if original is absent
            if (!productAttribute) {
              const attribute = await attributesCollection.findOne({ _id: attributeId });

              if (!attribute) {
                return {
                  success: false,
                  message: await getApiMessage('products.update.error'),
                };
              }

              productAttribute = {
                ...attribute,
                attributeId,
                productId: product._id,
                productSlug: product.slug,
                selectedOptionsIds: [],
                selectedOptionsSlugs: [],
                number: undefined,
                textI18n: {},
                showAsBreadcrumb: false,
                showInCard: true,
              };
            }

            // Update or create product attribute
            const { _id, ...restProductAttribute } = productAttribute;
            await productAttributesCollection.findOneAndUpdate(
              {
                _id,
              },
              {
                $set: {
                  ...restProductAttribute,
                  textI18n,
                },
              },
              {
                upsert: true,
                returnOriginal: false,
              },
            );
          }

          return {
            success: true,
            message: await getApiMessage('products.update.success'),
            payload: product,
          };
        } catch (e) {
          console.log(e);
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should update product counter
    t.nonNull.field('updateProductCounter', {
      type: 'Boolean',
      description: 'Should update product counter',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateProductCounterInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<boolean> => {
        try {
          const db = await getDatabase();
          const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
          const { role } = await getSessionRole(context);
          const { city } = await getRequestParams(context);
          if (!role.isStaff) {
            const { shopProductIds, companySlug } = args.input;
            const updatedShopProductsResult = await shopProductsCollection.updateMany(
              {
                _id: { $in: shopProductIds },
              },
              {
                $inc: {
                  [`views.${companySlug}.${city}`]: VIEWS_COUNTER_STEP,
                },
              },
            );
            if (!updatedShopProductsResult.result.ok) {
              return false;
            }
            return true;
          }
          return true;
        } catch (e) {
          console.log(e);
          return false;
        }
      },
    });
  },
});
