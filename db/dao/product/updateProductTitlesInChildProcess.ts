import { ObjectId } from 'mongodb';
import { updateProductTitles } from '../../../lib/updateProductTitles';
import { getCliParam } from '../../../tests/testUtils/testDbUtils';
require('dotenv').config();

const UNDEFINED_PARAM = 'undefined';

async function updateProductTitlesInChildProcess() {
  let match: Record<any, any> | null = null;

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
