import { COL_PRODUCT_CARD_DESCRIPTIONS, COL_PRODUCTS, COL_RUBRICS } from 'db/collectionNames';
import { CreateProductInputInterface } from 'db/dao/product/createProduct';
import {
  ProductCardDescriptionModel,
  ProductModel,
  ProductPayloadModel,
  RubricModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import { saveAlgoliaObjects } from 'lib/algoliaUtils';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { checkBarcodeIntersects, trimProductName } from 'lib/productUtils';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from 'lib/sessionHelpers';
import { checkProductDescriptionUniqueness } from 'lib/textUniquenessUtils';
import { ObjectId } from 'mongodb';
import { updateProductSchema } from 'validation/productSchema';

export interface UpdateProductInputInterface extends CreateProductInputInterface {
  productId: string;
}

export async function updateProduct({
  context,
  input,
}: DaoPropsInterface<UpdateProductInputInterface>): Promise<ProductPayloadModel> {
  const { getApiMessage, locale } = await getRequestParams(context);
  const { db, client } = await getDatabase();
  const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
  const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
  const productsCardDescriptionsCollection = db.collection<ProductCardDescriptionModel>(
    COL_PRODUCT_CARD_DESCRIPTIONS,
  );

  const session = client.startSession();

  let mutationPayload: ProductPayloadModel = {
    success: false,
    message: await getApiMessage(`products.update.error`),
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
        slug: 'updateProduct',
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
        schema: updateProductSchema,
      });
      await validationSchema.validate(input);

      const { productId, companySlug, cardDescriptionI18n, rubricId, ...values } = input;

      // check product availability
      const productObjectId = new ObjectId(productId);
      const product = await productsCollection.findOne({ _id: productObjectId });
      if (!product) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.update.notFound`),
        };
        await session.abortTransaction();
        return;
      }

      // check barcode intersects
      const barcodeDoubles = await checkBarcodeIntersects({
        locale,
        barcode: values.barcode,
        productId: product._id,
      });
      if (barcodeDoubles.length > 0) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.update.error`),
          barcodeDoubles,
        };
        await session.abortTransaction();
        return;
      }

      // get selected rubric
      const rubricObjectId = new ObjectId(rubricId);
      const rubric = await rubricsCollection.findOne({ _id: rubricObjectId });
      if (!rubric) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.update.error`),
        };
        await session.abortTransaction();
        return;
      }

      // check description uniqueness
      const cardDescription = await productsCardDescriptionsCollection.findOne({
        productId: product._id,
        companySlug,
      });
      await checkProductDescriptionUniqueness({
        product,
        cardDescriptionI18n,
        oldCardDescriptionI18n: cardDescription?.textI18n,
        companySlug,
      });

      // update product
      const { originalName, nameI18n } = trimProductName({
        nameI18n: values.nameI18n,
        originalName: values.originalName,
      });
      const updatedProductResult = await productsCollection.findOneAndUpdate(
        {
          _id: product._id,
        },
        {
          $set: {
            ...values,
            nameI18n,
            originalName,
            updatedAt: new Date(),
          },
        },
        {
          returnDocument: 'after',
        },
      );

      // Update card description
      const createdCardDescription = await productsCardDescriptionsCollection.findOneAndUpdate(
        {
          productId: product._id,
          companySlug,
        },
        {
          $set: {
            textI18n: cardDescriptionI18n || {},
          },
        },
        {
          upsert: true,
        },
      );
      if (!createdCardDescription.ok) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.create.error`),
        };
        await session.abortTransaction();
        return;
      }

      const updatedProduct = updatedProductResult.value;
      if (!updatedProductResult.ok || !updatedProduct) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.update.error`),
        };
        await session.abortTransaction();
        return;
      }

      // Update algolia product object
      const algoliaProductResult = await saveAlgoliaObjects({
        indexName: `${process.env.ALG_INDEX_PRODUCTS}`,
        objects: [
          {
            _id: updatedProduct._id.toHexString(),
            objectID: updatedProduct._id.toHexString(),
            itemId: updatedProduct.itemId,
            originalName: updatedProduct.originalName,
            nameI18n: updatedProduct.nameI18n,
            descriptionI18n: updatedProduct.descriptionI18n,
            barcode: updatedProduct.barcode,
          },
        ],
      });
      if (!algoliaProductResult) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.update.error`),
        };
        await session.abortTransaction();
        return;
      }

      mutationPayload = {
        success: true,
        message: await getApiMessage('products.update.success'),
        payload: updatedProduct,
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
