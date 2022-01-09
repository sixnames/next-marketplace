import { ObjectId } from 'mongodb';
import { FILTER_SEPARATOR } from '../../../config/common';
import { updateProductTitles } from '../../../lib/updateProductTitles';
import { getCliParam } from '../../../tests/testUtils/testDbUtils';
require('dotenv').config();

const UNDEFINED_PARAM = 'undefined';

async function updateProductTitlesInChildProcess() {
  let match: Record<any, any> | null = null;

  // by productIds
  const productIds = getCliParam('productIds');
  if (productIds !== UNDEFINED_PARAM) {
    const ids = productIds.split(FILTER_SEPARATOR);
    if (ids.length > 0) {
      match = {
        _id: {
          $in: ids.map((productId) => new ObjectId(productId)),
        },
      };
    }
  }

  // by product _id
  const productId = getCliParam('productId');
  if (productId !== UNDEFINED_PARAM) {
    match = {
      _id: new ObjectId(productId),
    };
  }

  // by rubric slug
  const rubricSlug = getCliParam('rubricSlug');
  if (rubricSlug !== UNDEFINED_PARAM) {
    match = {
      rubricSlug,
    };
  }

  // by attributeId
  const attributeId = getCliParam('attributeId');
  if (attributeId !== UNDEFINED_PARAM) {
    match = {
      'attributes.attributeId': attributeId,
    };
  }

  // by brandSlug
  const brandSlug = getCliParam('brandSlug');
  if (brandSlug !== UNDEFINED_PARAM) {
    match = {
      brandSlug,
    };
  }

  // by brandCollectionSlug
  const brandCollectionSlug = getCliParam('brandCollectionSlug');
  if (brandCollectionSlug !== UNDEFINED_PARAM) {
    match = {
      brandCollectionSlug,
    };
  }

  // by filterSlugs
  const filterSlugs = getCliParam('filterSlugs');
  if (brandCollectionSlug !== UNDEFINED_PARAM) {
    match = {
      filterSlugs,
    };
  }

  if (match) {
    await updateProductTitles(match);
  }
}

(() => {
  updateProductTitlesInChildProcess()
    .then(() => {
      process.exit();
    })
    .catch((e) => {
      console.log(e);
      process.exit();
    });
})();
