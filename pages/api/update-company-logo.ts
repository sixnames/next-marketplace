import { ASSETS_DIST_COMPANIES } from 'config/common';
import { COL_COMPANIES } from 'db/collectionNames';
import { CompanyModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { getApiMessageValue } from 'lib/apiMessageUtils';
import { deleteUpload, storeRestApiUploads } from 'lib/assets';
import { parseRestApiFormData } from 'lib/restApi';
import { getOperationPermission } from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Permission
  const { allow, message } = await getOperationPermission({
    context: {
      req,
      res,
    },
    slug: 'updateCompany',
  });
  if (!allow) {
    res.status(500).send({
      success: false,
      message: message,
    });
    return;
  }

  const { db } = await getDatabase();
  const companiesCollection = db.collection<CompanyModel>(COL_COMPANIES);
  const formData = await parseRestApiFormData(req);
  const { locale } = req.cookies;

  if (!formData || !formData.files || !formData.fields) {
    res.status(500).send({
      success: false,
      message: await getApiMessageValue({
        slug: 'companies.update.error',
        locale,
      }),
    });
    return;
  }

  const companyId = new ObjectId(`${formData.fields.companyId}`);

  // Check company availability
  const company = await companiesCollection.findOne({ _id: companyId });
  if (!company) {
    res.status(500).send({
      success: false,
      message: await getApiMessageValue({
        slug: 'companies.update.error',
        locale,
      }),
    });
    return;
  }

  // Delete company logo
  const removedAsset = await deleteUpload({ filePath: `${company.logo.url}` });
  if (!removedAsset) {
    res.status(500).send({
      success: false,
      message: await getApiMessageValue({
        slug: 'companies.update.error',
        locale,
      }),
    });
    return;
  }

  // Upload new company logo
  const uploadedLogo = await storeRestApiUploads({
    files: formData.files,
    itemId: company.itemId,
    dist: ASSETS_DIST_COMPANIES,
    startIndex: 0,
  });

  if (!uploadedLogo) {
    res.status(500).send({
      success: false,
      message: await getApiMessageValue({
        slug: 'companies.update.error',
        locale,
      }),
    });
    return;
  }
  const logo = uploadedLogo[0];
  if (!logo) {
    res.status(500).send({
      success: false,
      message: await getApiMessageValue({
        slug: 'companies.update.error',
        locale,
      }),
    });
    return;
  }

  // Update company
  const updatedCompanyResult = await companiesCollection.findOneAndUpdate(
    { _id: companyId },
    {
      $set: {
        updatedAt: new Date(),
        logo,
      },
    },
    {
      returnOriginal: false,
    },
  );
  const updatedCompany = updatedCompanyResult.value;
  if (!updatedCompanyResult.ok || !updatedCompany) {
    res.status(500).send({
      success: false,
      message: await getApiMessageValue({
        slug: 'companies.update.error',
        locale,
      }),
    });
    return;
  }

  res.status(200).send({
    success: true,
    message: await getApiMessageValue({
      slug: 'companies.update.success',
      locale,
    }),
  });
};
