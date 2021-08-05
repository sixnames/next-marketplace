import { CompanyInterface } from 'db/uiInterfaces';
import CmsWrapper from 'layout/CmsLayout/CmsWrapper';
import { noNaN } from 'lib/numbers';
import { useRouter } from 'next/router';
import * as React from 'react';
import Spinner from 'components/Spinner';
import { useUserContext } from 'context/userContext';
import { PageUrlsInterface } from '../Meta';

interface ConsoleLayoutInterface {
  description?: string;
  title?: string;
  pageUrls: PageUrlsInterface;
  company?: CompanyInterface | null;
}

const ConsoleLayoutConsumer: React.FC<ConsoleLayoutInterface> = ({
  children,
  company,
  pageUrls,
  title,
}) => {
  const router = useRouter();
  const { me } = useUserContext();

  React.useEffect(() => {
    if (noNaN(me?.companies?.length) < 1) {
      router.push('/').catch((e) => console.log(e));
    }
  }, [me, router, company]);

  if (!company) {
    return <Spinner />;
  }

  return (
    <CmsWrapper pageUrls={pageUrls} title={title} company={company}>
      {children}
    </CmsWrapper>
  );
};

const ConsoleLayout: React.FC<ConsoleLayoutInterface> = ({
  children,
  company,
  pageUrls,
  title,
}) => {
  return (
    <ConsoleLayoutConsumer pageUrls={pageUrls} title={title} company={company}>
      {children}
    </ConsoleLayoutConsumer>
  );
};

export default ConsoleLayout;
