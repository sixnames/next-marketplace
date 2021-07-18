import { CompanyModel, UserModel } from 'db/dbModels';
import path from 'path';
import fs from 'fs';

export interface UpdateCompanyDomainInterface {
  company: CompanyModel;
  newDomain?: string | null;
  sessionUser: UserModel;
}

export async function updateCompanyDomain({
  company,
  newDomain,
  sessionUser,
}: UpdateCompanyDomainInterface): Promise<boolean> {
  try {
    // if domain name updated
    if (company.domain !== newDomain) {
      const domainsPath = path.join(process.cwd(), 'domains');

      const fileData = {
        company,
        createdAt: new Date(),
        user: sessionUser,
      };

      // remove old domain name if exist
      if (company.domain && company.domain.length > 0) {
        const domainsDeletePath = path.join(domainsPath, 'delete/todo', company.domain);
        fs.writeFileSync(domainsDeletePath, JSON.stringify(fileData, null, 2));
      }

      // if new domain added
      if (newDomain && newDomain.length > 0) {
        const domainsCreatePath = path.join(domainsPath, 'create/todo', newDomain);
        fs.writeFileSync(domainsCreatePath, JSON.stringify(fileData, null, 2));
      }
    }

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}
