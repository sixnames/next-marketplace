import { UserCompanyFragment, useUserComapnyQuery } from 'generated/apolloComponents';
import * as React from 'react';

interface CompanyContextInterface {
  company?: UserCompanyFragment | null;
}

const CompanyContext = React.createContext<CompanyContextInterface>({
  company: null,
});

const CompanyContextProvider: React.FC = ({ children }) => {
  const { data } = useUserComapnyQuery();

  const value = React.useMemo(() => {
    return {
      company: data?.getUserCompany,
    };
  }, [data]);

  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>;
};

function useCompanyContext() {
  const context = React.useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompanyContext must be used within a CompanyContextProvider');
  }

  return context;
}

export { CompanyContextProvider, useCompanyContext };
