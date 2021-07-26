import { CompanyModel, UserModel } from 'db/dbModels';
import path from 'path';
import fs from 'fs';

export interface UpdateCompanyDomainInterface {
  company: CompanyModel;
  newDomain?: string | null;
  sessionUser: UserModel;
  isNewCompany?: boolean;
}

export async function updateCompanyDomain({
  company,
  newDomain,
  sessionUser,
  isNewCompany,
}: UpdateCompanyDomainInterface): Promise<boolean> {
  try {
    const domainsPath = path.join(process.cwd(), 'domains');
    const domainsDeletePath = path.join(domainsPath, 'delete/todo', `${company.domain}`);
    const domainsCreatePath = path.join(domainsPath, 'create/todo', `${newDomain}`);

    const fileData = {
      company,
      createdAt: new Date(),
      user: sessionUser,
    };

    // if new company created with domain
    if (isNewCompany && company.domain) {
      fs.writeFileSync(domainsCreatePath, JSON.stringify(fileData, null, 2));
      return true;
    }

    // if domain name updated
    if (company.domain !== newDomain) {
      // remove old domain name if exist
      if (company.domain && company.domain.length > 0) {
        fs.writeFileSync(domainsDeletePath, JSON.stringify(fileData, null, 2));
      }

      // if new domain added
      if (newDomain && newDomain.length > 0) {
        fs.writeFileSync(domainsCreatePath, JSON.stringify(fileData, null, 2));
      }
    }

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}
