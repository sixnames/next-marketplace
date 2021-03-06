import { getDbCollections } from 'db/mongodb';
import { getApiMessageValue } from 'db/utils/apiMessageUtils';
import { deleteUpload, storeUploads } from 'lib/assetUtils/assetUtils';
import { ASSETS_DIST_COMPANIES, ASSETS_LOGO_WIDTH } from 'lib/config/common';
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

  const collections = await getDbCollections();
  const companiesCollection = collections.companiesCollection();
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
  const removedAsset = await deleteUpload(`${company.logo}`);
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
  const uploadedLogo = await storeUploads({
    files: formData.files,
    dirName: company.itemId,
    dist: ASSETS_DIST_COMPANIES,
    width: ASSETS_LOGO_WIDTH,
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
      returnDocument: 'after',
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
